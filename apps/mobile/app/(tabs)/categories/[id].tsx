import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, PlusIcon, MicIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useQuery } from '@tanstack/react-query';
import { getOneCategory } from '@/services/category.service';
import { getAllVoiceSessions } from '@/services/voiceSession.service';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  // Fetch category from database
  const { data: category, isLoading: categoryLoading, isError: categoryError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getOneCategory(Number(id)),
    enabled: !!id,
  });

  // Fetch all voice sessions (we'll filter by category later)
  const { data: allVoiceSessions, isLoading: notesLoading } = useQuery({
    queryKey: ['voiceSessions'],
    queryFn: getAllVoiceSessions,
  });

  // Filter voice sessions by categoryId
  // Note: The VoiceSession table doesn't have categoryId yet, so this will return empty for now
  const notes = allVoiceSessions || [];

  if (categoryLoading || notesLoading) {
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

  if (categoryError || !category) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Error',
          }}
        />
        <Text className="text-red-500 text-center mb-4">
          Category not found
        </Text>
        <Pressable
          onPress={() => router.back()}
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
          headerTitle: category.name + ' Notes',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-4">
              <ArrowLeftIcon size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          ),
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-6 pt-4">
          {/* Category Header */}
          <View className="mb-6">
            <View className="flex-row items-center gap-4 mb-3">
              <Text className="text-6xl">{category.icon}</Text>
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground">
                  {category.name}
                </Text>
                {category.description && (
                  <Text className="text-muted-foreground mt-1">
                    {category.description}
                  </Text>
                )}
              </View>
            </View>

            <View className="bg-primary/10 px-4 py-2 rounded-full self-start">
              <Text className="text-primary font-medium">
                {notes.length} voice notes
              </Text>
            </View>
          </View>

          {/* Create New Note Button */}
          <Pressable
            onPress={() => {
              // TODO: Navigate to voice recording screen
              console.log('Create new note for category:', id);
            }}
            className="bg-primary rounded-2xl p-5 mb-6 active:opacity-80"
          >
            <View className="flex-row items-center justify-center gap-3">
              <MicIcon size={24} color="#fff" />
              <Text className="text-white text-lg font-semibold">
                Record New Note
              </Text>
            </View>
          </Pressable>

          {/* Notes List */}
          <View className="mb-4">
            <Text className="text-xl font-semibold text-foreground mb-3">
              Voice Notes
            </Text>
          </View>

          {notes.length === 0 ? (
            <View className="bg-card border border-border rounded-2xl p-8 items-center">
              <MicIcon size={48} color="#999" />
              <Text className="text-muted-foreground text-center mt-3">
                No voice notes yet
              </Text>
              <Text className="text-muted-foreground text-center text-sm mt-1">
                Tap the button above to record your first note
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {notes.map((note) => (
                <Pressable
                  key={note.id}
                  onPress={() => {
                    // TODO: Navigate to note detail screen
                    console.log('View note:', note.id);
                  }}
                  className="bg-card border border-border rounded-2xl p-4 active:opacity-80"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-foreground font-semibold text-base flex-1">
                      {note.name}
                    </Text>
                  </View>

                  <Text className="text-muted-foreground text-sm mb-2" numberOfLines={2}>
                    {note.summary || note.transcript || 'No transcription available'}
                  </Text>

                  <Text className="text-muted-foreground text-xs">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
