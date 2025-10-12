import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable } from 'react-native';
import { PlusIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const SAMPLE_CATEGORIES = [
  { id: 1, name: 'Work', icon: '💼', count: 12 },
  { id: 2, name: 'Personal', icon: '👤', count: 8 },
  { id: 3, name: 'Meetings', icon: '🤝', count: 15 },
  { id: 4, name: 'Ideas', icon: '💡', count: 6 },
  { id: 5, name: 'Projects', icon: '📊', count: 10 },
  { id: 6, name: 'Learning', icon: '📚', count: 5 },
];

export default function CategoriesScreen() {
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 pt-16">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Categories
          </Text>
          <Text className="text-muted-foreground">
            Organize your voice notes
          </Text>
        </View>

        {/* Create New Category Button */}
        <Pressable className="bg-primary rounded-2xl p-5 mb-6 active:opacity-80">
          <View className="flex-row items-center justify-center gap-3">
            <PlusIcon size={24} className="text-secondary" />
            <Text className="text-secondary text-lg font-semibold">
              Create New Category
            </Text>
          </View>
        </Pressable>

        {/* Categories Grid */}
        <View className="flex-row flex-wrap gap-3">
          {SAMPLE_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              className="bg-card border border-border rounded-2xl p-5 active:opacity-80"
              style={{ width: '48%' }}
            >
              <View className="items-center">
                <Text className="text-5xl mb-3">{category.icon}</Text>
                <Text className="text-foreground font-semibold text-center mb-1">
                  {category.name}
                </Text>
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-primary text-xs font-medium">
                    {category.count} notes
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
