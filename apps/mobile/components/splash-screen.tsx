import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-8xl mb-8">📝</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
