import { Text } from '@/components/ui/text';
import { View, Pressable, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { CategoryInsert } from '@/lib/schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from 'rn-emoji-keyboard';
import { toast } from 'sonner-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { createCategory } from '@/services/category.service';
import { useQueryClient } from '@tanstack/react-query';

export default function NewCategoryScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const queryClient = useQueryClient();
  const { reset, handleSubmit, control, formState: { errors }, setValue } = useForm<CategoryInsert>();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CategoryInsert) => {
    try {
      setIsSubmitting(true);
      const newCategory = await createCategory(data);
      toast.success('Category created successfully');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset();
      router.replace(`/(tabs)/categories/${newCategory.id}` as any);
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'New Category',
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(tabs)/categories')} className="mr-4">
              <ArrowLeftIcon size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          ),
        }}
      />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        bottomOffset={50}
      >
        {/* Category Name */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            Category Name <Text className="text-red-500">*</Text>
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Category name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="e.g., Work, Personal, Meetings"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Category Icon */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            Category Icon <Text className="text-red-500">*</Text>
          </Text>
          <Controller
            control={control}
            name="icon"
            rules={{ required: 'Category icon is required' }}
            render={({ field: { value } }) => (
              <View>
                <Pressable
                  onPress={() => {
                    // Dismiss keyboard when opening emoji picker
                    Keyboard.dismiss();
                    setIsEmojiPickerOpen(true);
                  }}
                  className="bg-card border border-border rounded-lg p-4 active:opacity-80"
                >
                  <View className="flex-row items-center gap-3">
                    {value ? (
                      <>
                        <Text className="text-4xl">{value}</Text>
                        <Text className="text-foreground">Tap to change emoji</Text>
                      </>
                    ) : (
                      <Text className="text-muted-foreground">Tap to select an emoji</Text>
                    )}
                  </View>
                </Pressable>
              </View>
            )}
          />
          {errors.icon && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.icon.message}
            </Text>
          )}
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Textarea
                placeholder="Optional description for this category"
                onBlur={onBlur}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                onChangeText={onChange}
                value={value ?? undefined}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-primary rounded-xl p-4 active:opacity-80 mt-4"
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <Text className="text-white text-center text-secondary font-semibold">
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>

      {/* Emoji Picker Modal */}
      <EmojiPicker
        onEmojiSelected={(emoji) => {
          setValue('icon', emoji.emoji);
          setIsEmojiPickerOpen(false);
        }}
        open={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        theme={{
          backdrop: colorScheme === 'dark' ? '#000000DD' : '#00000066',
          knob: colorScheme === 'dark' ? '#666' : '#ccc',
          container: colorScheme === 'dark' ? '#1C1C1E' : '#fff',
          header: colorScheme === 'dark' ? '#fff' : '#000',
          skinTonesContainer: colorScheme === 'dark' ? '#252427' : '#F5F5F5',
          search: {
            text: colorScheme === 'dark' ? '#fff' : '#000',
            placeholder: colorScheme === 'dark' ? '#888' : '#888',
            background: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
          },
          category: {
            icon: colorScheme === 'dark' ? '#888' : '#888',
            iconActive: colorScheme === 'dark' ? '#fff' : '#000',
            container: colorScheme === 'dark' ? '#1C1C1E' : '#fff',
            containerActive: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
          },
        }}
      />
    </View>
  );
}