import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, Trash2Icon, MicIcon, CheckIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOneVoiceSession, deleteVoiceSession, updateVoiceSession } from '@/services/voiceSession.service';
import { toast } from 'sonner-native';
import { useSpeechToText, WHISPER_TINY_EN } from 'react-native-executorch';
import { AudioManager, AudioRecorder } from 'react-native-audio-api';
import { useEffect, useState } from 'react';

export default function VoiceNoteDetailScreen() {
  const { id, voiceId } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const queryClient = useQueryClient();

  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  const model = useSpeechToText({
    model: WHISPER_TINY_EN,
  });

  useEffect(() => {
    let mounted = true;
    let recorderInstance: AudioRecorder | null = null;
    let interruptionSubscription: any = null;

    const setupAudio = async () => {
      try {
        // Request permissions FIRST
        const granted = await AudioManager.requestRecordingPermissions();
        if (!granted || !mounted) {
          toast.error('Microphone permission denied');
          return;
        }

        // Configure audio session options with more compatible settings for simulator
        AudioManager.setAudioSessionOptions({
          iosCategory: 'playAndRecord',
          iosMode: 'measurement', // Changed from 'spokenAudio' for better simulator compatibility
          iosOptions: ['defaultToSpeaker'],
        });

        // Enable audio interruption observation
        AudioManager.observeAudioInterruptions(true);

        // Listen for audio interruptions
        interruptionSubscription = AudioManager.addSystemEventListener(
          'interruption',
          (event) => {
            console.log('Audio interruption:', event);
            if (event.type === 'ended') {
              // Try to reactivate session after interruption
              AudioManager.setAudioSessionActivity(true).catch(console.error);
            }
          }
        );

        // Activate the audio session
        const activated = await AudioManager.setAudioSessionActivity(true);
        if (!activated || !mounted) {
          toast.error('Failed to activate audio session');
          return;
        }

        // Longer delay for simulator to stabilize
        await new Promise(resolve => setTimeout(resolve, 300));

        // Only create recorder AFTER audio session is configured and activated
        recorderInstance = new AudioRecorder({
          sampleRate: 16000,
          bufferLengthInSamples: 1600,
        });

        if (mounted) {
          setRecorder(recorderInstance);
          setAudioReady(true);
        }
      } catch (error) {
        console.error('Failed to setup audio:', error);
        toast.error('Failed to setup audio');
      }
    };

    setupAudio();

    return () => {
      mounted = false;
      refetch();

      // reset all states
      setAudioReady(false);
      setIsRecording(false);
      setTranscription('');
      setRecorder(null);

      // Disable interruption observation
      AudioManager.observeAudioInterruptions(false);

      // Remove interruption listener
      if (interruptionSubscription) {
        interruptionSubscription.remove();
      }

      // Cleanup recorder
      if (recorderInstance) {
        try {
          recorderInstance.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }

      // Deactivate audio session
      AudioManager.setAudioSessionActivity(false).catch(() => {
        // Ignore errors on cleanup
      });
    };
  }, []);

  // Fetch voice session
  const { data: note, isLoading, isError, refetch } = useQuery({
    queryKey: ['voiceSession', voiceId],
    queryFn: () => getOneVoiceSession(Number(voiceId)),
    enabled: !!voiceId,
  });

  // Update voice session transcription when changed
  const updateMutation = useMutation({
    mutationFn: (newTranscript: string) =>
      updateVoiceSession(Number(voiceId), { transcript: newTranscript }),
    onSuccess: (updatedNote) => {
      toast.success('Transcript updated');
      setTranscription('');
      if (updatedNote) {
        queryClient.invalidateQueries({ queryKey: ['voiceSessions'] });
        queryClient.invalidateQueries({ queryKey: ['voiceSession', voiceId] });
      }
    },
    onError: (error) => {
      console.error('Failed to update note:', error);
      toast.error('Failed to update note');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteVoiceSession(Number(voiceId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voiceSessions'] });
      toast.success('Note deleted');
      router.push(`/(tabs)/categories/${id}`);
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleRecord = async () => {
    if (!recorder || !audioReady) {
      toast.error('Audio system not ready');
      return;
    }

    if (isRecording) {
      // Stop recording
      setIsRecording(false);

      try {
        recorder.stop();
        model.streamStop();

        // Wait a bit for final processing
        await new Promise(resolve => setTimeout(resolve, 300));

        if (model.committedTranscription) {
          console.log('Final transcription:', model.committedTranscription);
          setTranscription(model.committedTranscription + model.nonCommittedTranscription);
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast.error('Failed to stop recording');
      }
    } else {
      // Start recording
      try {
        // Ensure audio session is active before starting
        const isActive = await AudioManager.setAudioSessionActivity(true);
        if (!isActive) {
          toast.error('Audio session not active');
          return;
        }

        // Small delay to let audio session stabilize (important for simulator)
        await new Promise(resolve => setTimeout(resolve, 100));

        setIsRecording(true);
        setTranscription('');

        // Setup audio callback
        recorder.onAudioReady(({ buffer }) => {
          try {
            const audioData = buffer.getChannelData(0);
            model.streamInsert(audioData);
          } catch (err) {
            console.error('Error processing audio buffer:', err);
          }
        });

        // Start recorder first
        recorder.start();

        // Small delay before starting model (helps with simulator stability)
        await new Promise(resolve => setTimeout(resolve, 50));

        // Then start model streaming
        await model.stream();
      } catch (error) {
        console.error('Error during recording:', error);
        const errorMsg = error instanceof Error ? error.message : 'Recording failed';
        toast.error(errorMsg);
        setIsRecording(false);

        // Try to recover the audio session
        try {
          recorder.stop();
        } catch (stopError) {
          console.error('Error stopping recorder after failure:', stopError);
        }
      }
    }
  };

  const handleDone = () => {
    console.log('Saving transcription:', transcription);
    if (!transcription) {
      toast.error('No transcription to save');
      return;
    }
    updateMutation.mutate(transcription);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Loading...',
          }}
        />
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
      </View>
    );
  }

  if (isError || !note) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Error',
          }}
        />
        <Text className="text-red-500 text-center mb-4">
          Note not found
        </Text>
        <Pressable
          onPress={() => router.replace(`/(tabs)/categories/${id}`)}
          className="bg-primary rounded-2xl px-6 py-3"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: note.name,
          headerLeft: () => (
            <Pressable onPress={() => router.replace(`/(tabs)/categories/${id}`)} className="mr-4">
              <ArrowLeftIcon size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          ),
        }}
      />

      <ScrollView className="flex-1 p-6 mb-40">
        <Text className="text-foreground text-base leading-7">
          {transcription || note.transcript || 'No transcript available yet. Tap the Record button to start recording.'}
        </Text>
        {(isRecording || model.isGenerating) && (model.committedTranscription || model.nonCommittedTranscription) && (
          <Text className="text-muted-foreground text-base leading-7 mt-4">
            {model.committedTranscription}
            <Text className="text-primary">{model.nonCommittedTranscription}</Text>
          </Text>
        )}
      </ScrollView>

      {/* Floating Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-8">
        <View className="flex-row items-center justify-around">
          <Pressable
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            className="items-center active:opacity-60"
          >
            <View className="bg-destructive/10 w-14 h-14 rounded-full items-center justify-center mb-1">
              {deleteMutation.isPending ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Trash2Icon size={24} color="#ef4444" />
              )}
            </View>
            <Text className="text-xs text-muted-foreground">Delete</Text>
          </Pressable>

          <Pressable
            onPress={handleRecord}
            disabled={!model.isReady || !audioReady}
            className="items-center active:opacity-60"
          >
            <View className="bg-primary w-16 h-16 rounded-full items-center justify-center mb-1" style={{ opacity: !model.isReady || !audioReady ? 0.5 : 1 }}>
              {isRecording || model.isGenerating ? (
                <ActivityIndicator size="small" className="text-secondary" />
              ) : (
                <MicIcon size={28} color={colorScheme === 'dark' ? '#000' : '#fff'} />
              )}
            </View>
            <Text className="text-xs text-muted-foreground">
              {!audioReady ? 'Setting up...' : isRecording ? 'Stop' : 'Record'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDone}
            className="items-center active:opacity-60"
          >
            <View className="bg-primary/10 w-14 h-14 rounded-full items-center justify-center mb-1">
              {updateMutation.isPending ? (
                <ActivityIndicator size="small" className="text-secondary" />
              ) : (
                <CheckIcon size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
              )}
            </View>
            <Text className="text-xs text-muted-foreground">Done</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
