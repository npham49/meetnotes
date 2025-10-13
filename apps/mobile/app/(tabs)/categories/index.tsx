import { Text } from '@/components/ui/text';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { PlusIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import { getAllCategories } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';

export default function CategoriesScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['categories'], queryFn: getAllCategories });

  return (
    <ScrollView className="flex-1 bg-background" >
      <View className="p-6 pt-16">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Categories
          </Text>
          <Text className="text-muted-foreground">
            Organize your voice notes
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/categories/new')}
          className="bg-primary rounded-2xl p-5 mb-6 active:opacity-80"
        >
          <View className="flex-row items-center justify-center gap-3">
            <PlusIcon size={24} color="#fff" />
            <Text className="text-white text-lg font-semibold">
              Create New Category
            </Text>
          </View>
        </Pressable>
        {
          isError && <Text className="text-red-500">Error loading categories: {error?.message}</Text>
        }

        {isLoading ? (
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {data?.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => router.push(`/(tabs)/categories/${category.id}` as any)}
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
                      0 notes
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
