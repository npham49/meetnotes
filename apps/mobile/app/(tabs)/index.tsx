import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable } from 'react-native';
import { MicIcon, FolderPlusIcon, ClockIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const RECENT_NOTES = [
  { id: 1, name: 'Team Standup', date: '2 hours ago', duration: '5 min' },
  { id: 2, name: 'Client Meeting', date: 'Yesterday', duration: '12 min' },
  { id: 3, name: 'Project Review', date: '2 days ago', duration: '8 min' },
];

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 pt-16">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Home
          </Text>
          <Text className="text-muted-foreground">
            Welcome back! Start recording or browse your notes
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </Text>

          <View className="gap-3">
            {/* New Voice Note - Large Button */}
            <Pressable className="bg-primary rounded-2xl p-6 active:opacity-80">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="bg-secondary/20 p-3 rounded-xl">
                    <MicIcon size={28} color="#fff" />
                  </View>
                  <View>
                    <Text className="text-secondary text-lg font-semibold">
                      New Voice Note
                    </Text>
                    <Text className="text-secondary text-sm">
                      Start recording
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Secondary Actions */}
            <View className="flex-row gap-3">
              <Pressable className="flex-1 bg-card border border-border rounded-xl p-4 active:opacity-80">
                <FolderPlusIcon
                  size={24}
                  color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
                <Text className="text-foreground font-semibold mt-2">
                  New Category
                </Text>
                <Text className="text-muted-foreground text-xs mt-1">
                  Organize notes
                </Text>
              </Pressable>

              <Pressable className="flex-1 bg-card border border-border rounded-xl p-4 active:opacity-80">
                <ClockIcon
                  size={24}
                  color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
                <Text className="text-foreground font-semibold mt-2">
                  Recent
                </Text>
                <Text className="text-muted-foreground text-xs mt-1">
                  View all notes
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Recent Notes */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-foreground">
              Recent Notes
            </Text>
            <Button variant="ghost" size="sm">
              <Text className="text-primary">See All</Text>
            </Button>
          </View>

          <View className="gap-3">
            {RECENT_NOTES.map((note) => (
              <Pressable
                key={note.id}
                className="bg-card border border-border rounded-xl p-4 active:opacity-80"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold mb-1">
                      {note.name}
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      {note.date} • {note.duration}
                    </Text>
                  </View>
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary text-xs font-medium">
                      Voice
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
