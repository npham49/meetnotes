import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { initDatabase } from '@/lib/db';
import { setSyncMode, setOnboardingComplete } from '@/services/storage.service';
import { useRouter, Stack } from 'expo-router';
import { CloudIcon, DatabaseIcon, CheckIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [selectedMode, setSelectedMode] = useState<'offline' | 'online' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedMode) return;

    setIsLoading(true);
    try {
      await setSyncMode(selectedMode);
      await setOnboardingComplete();
      await initDatabase(selectedMode);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Welcome',
          headerShown: false,
        }}
      />
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 px-6 py-12">
          {/* Header */}
          <View className="mb-12">
            <Text className="text-4xl font-bold text-foreground mb-4">
              Welcome to MeetNotes
            </Text>
            <Text className="text-lg text-muted-foreground">
              Choose how you'd like to store your notes
            </Text>
          </View>

          {/* Options */}
          <View className="gap-4 mb-8">
            {/* Offline Option */}
            <Pressable
              onPress={() => setSelectedMode('offline')}
              className={`
                border-2 rounded-2xl p-6
                ${selectedMode === 'offline'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
                }
              `}
            >
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-primary/20 p-3 rounded-xl">
                  <DatabaseIcon
                    size={28}
                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                  />
                </View>
                {selectedMode === 'offline' && (
                  <View className="bg-primary p-1 rounded-full">
                    <CheckIcon size={20} color="#fff" />
                  </View>
                )}
              </View>

              <Text className="text-2xl font-semibold text-foreground mb-2">
                Offline Mode
              </Text>
              <Text className="text-muted-foreground mb-4">
                Store all your notes locally on your device. Your data stays private and works without internet.
              </Text>

              <View className="flex-row flex-wrap gap-2">
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-xs text-primary font-medium">
                    ✓ 100% Private
                  </Text>
                </View>
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-xs text-primary font-medium">
                    ✓ No Internet Required
                  </Text>
                </View>
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-xs text-primary font-medium">
                    ✓ Instant Access
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* Online Option (Disabled) */}
            <View
              className="
                border-2 border-border bg-muted/30 rounded-2xl p-6
                opacity-50
              "
            >
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-muted p-3 rounded-xl">
                  <CloudIcon
                    size={28}
                    color={colorScheme === 'dark' ? '#666' : '#999'}
                  />
                </View>
                <View className="bg-muted px-3 py-1 rounded-full">
                  <Text className="text-xs text-muted-foreground font-medium">
                    Coming Soon
                  </Text>
                </View>
              </View>

              <Text className="text-2xl font-semibold text-muted-foreground mb-2">
                Online Sync
              </Text>
              <Text className="text-muted-foreground mb-4">
                Sync your notes across all devices. Requires account creation and internet connection.
              </Text>

              <View className="flex-row flex-wrap gap-2">
                <View className="bg-muted px-3 py-1 rounded-full">
                  <Text className="text-xs text-muted-foreground font-medium">
                    ○ Cross-Device Sync
                  </Text>
                </View>
                <View className="bg-muted px-3 py-1 rounded-full">
                  <Text className="text-xs text-muted-foreground font-medium">
                    ○ Cloud Backup
                  </Text>
                </View>
                <View className="bg-muted px-3 py-1 rounded-full">
                  <Text className="text-xs text-muted-foreground font-medium">
                    ○ Share Notes
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <Button
            onPress={handleContinue}
            disabled={!selectedMode || isLoading}
            className="w-full"
          >
            <Text className="text-lg font-semibold">
              {isLoading ? 'Setting up...' : 'Continue'}
            </Text>
          </Button>

          {/* Footer Note */}
          <Text className="text-center text-sm text-muted-foreground mt-6">
            You can change this setting later in the app settings
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
