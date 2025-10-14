import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, Trash2Icon, MicIcon, CheckIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOneVoiceSession, deleteVoiceSession } from '@/services/voiceSession.service';
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

  const [recorder] = useState(
    () =>
      new AudioRecorder({
        sampleRate: 16000,
        bufferLengthInSamples: 1600,
      })
  );

  const model = useSpeechToText({
    model: WHISPER_TINY_EN,
  });

  useEffect(() => {
    AudioManager.setAudioSessionOptions({
      iosCategory: 'playAndRecord',
      iosMode: 'spokenAudio',
      iosOptions: ['allowBluetooth', 'defaultToSpeaker'],
    });
    AudioManager.requestRecordingPermissions();
  }, []);

  // Fetch voice session
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['voiceSession', voiceId],
    queryFn: () => getOneVoiceSession(Number(voiceId)),
    enabled: !!voiceId,
  });

  // Update voice session transcription when changed
  const updateMutation = useMutation({
    mutationFn: (newTranscript: string) =>
      getOneVoiceSession(Number(voiceId)).then((note) =>
        note
          ? {
            ...note,
            transcript: newTranscript,
          }
          : null
      ),
    onSuccess: (updatedNote) => {
      toast.success('Transcript updated');
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
    if (isRecording) {
      // set a 500ms timeout to allow model to process final audio
      setTimeout(() => {
        setIsRecording(false);
        recorder.stop();
        model.streamStop();
        if (model.committedTranscription) {
          setTranscription(model.committedTranscription);
        }
      }, 500);
    } else {
      setIsRecording(true);
      setTranscription('');
      recorder.onAudioReady(({ buffer }) => {
        model.streamInsert(buffer.getChannelData(0));
      });
      recorder.start();
      try {
        await model.stream();
      } catch (error) {
        console.error('Error during recording:', error);
        toast.error('Recording failed');
      }
      setIsRecording(false);
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
          onPress={() => router.push(`/(tabs)/categories/${id}`)}
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
            <Pressable onPress={() => router.push(`/(tabs)/categories/${id}`)} className="mr-4">
              <ArrowLeftIcon size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          ),
        }}
      />

      <ScrollView className="flex-1 p-6">
        <Text className="text-foreground text-base leading-7 mb-40">
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
            disabled={!model.isReady}
            className="items-center active:opacity-60"
          >
            <View className="bg-primary w-16 h-16 rounded-full items-center justify-center mb-1" style={{ opacity: !model.isReady ? 0.5 : 1 }}>
              {isRecording || model.isGenerating ? (
                <ActivityIndicator size="small" className="text-secondary" />
              ) : (
                <MicIcon size={28} color={colorScheme === 'dark' ? '#000' : '#fff'} />
              )}
            </View>
            <Text className="text-xs text-muted-foreground">
              {isRecording ? 'Stop' : 'Record'}
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
