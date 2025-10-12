import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable } from 'react-native';
import { SunIcon, MoonIcon, WifiOffIcon, CloudIcon, ChevronRightIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 pt-16">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Settings
          </Text>
          <Text className="text-muted-foreground">
            Customize your experience
          </Text>
        </View>

        {/* Appearance Section */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
            Appearance
          </Text>

          <View className="bg-card border border-border rounded-2xl overflow-hidden">
            <Pressable
              onPress={toggleColorScheme}
              className="flex-row items-center justify-between p-4 active:bg-muted"
            >
              <View className="flex-row items-center gap-4">
                <View className="bg-primary/10 p-2 rounded-lg">
                  {colorScheme === 'dark' ? (
                    <MoonIcon size={24} color="#fff" />
                  ) : (
                    <SunIcon size={24} color="#000" />
                  )}
                </View>
                <View>
                  <Text className="text-foreground font-semibold">
                    Theme
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                </View>
              </View>
              <ChevronRightIcon size={20} color="#999" />
            </Pressable>
          </View>
        </View>

        {/* Sync Section */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
            Data & Sync
          </Text>

          <View className="bg-card border border-border rounded-2xl overflow-hidden">
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-green-500/10 p-2 rounded-lg">
                    <WifiOffIcon size={24} color="#22c55e" />
                  </View>
                  <View>
                    <Text className="text-foreground font-semibold">
                      Offline Mode
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      All data stored locally
                    </Text>
                  </View>
                </View>
                <View className="bg-green-500/10 px-3 py-1 rounded-full">
                  <Text className="text-green-500 text-xs font-medium">
                    Active
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-4 opacity-50">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-muted p-2 rounded-lg">
                    <CloudIcon size={24} color="#999" />
                  </View>
                  <View>
                    <Text className="text-foreground font-semibold">
                      Online Sync
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      Coming soon
                    </Text>
                  </View>
                </View>
                <View className="bg-muted px-3 py-1 rounded-full">
                  <Text className="text-muted-foreground text-xs font-medium">
                    Soon
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View>
          <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
            About
          </Text>

          <View className="bg-card border border-border rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center justify-between p-4 active:bg-muted border-b border-border">
              <Text className="text-foreground font-semibold">
                Version
              </Text>
              <Text className="text-muted-foreground">
                1.0.0
              </Text>
            </Pressable>

            <Pressable className="flex-row items-center justify-between p-4 active:bg-muted border-b border-border">
              <Text className="text-foreground font-semibold">
                Privacy Policy
              </Text>
              <ChevronRightIcon size={20} color="#999" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between p-4 active:bg-muted">
              <Text className="text-foreground font-semibold">
                Terms of Service
              </Text>
              <ChevronRightIcon size={20} color="#999" />
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
