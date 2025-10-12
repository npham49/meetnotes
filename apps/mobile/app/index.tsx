import { hasCompletedOnboarding } from '@/services/storage.service';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Screen() {
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const completed = await hasCompletedOnboarding();
        router.replace(completed ? '/(tabs)' : '/onboarding');
      } catch (error) {
        console.error('Error checking onboarding:', error);
        router.replace('/onboarding');
      }
    }

    checkOnboarding();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" />
    </View>
  );
}

