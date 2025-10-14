import { Tabs, useSegments } from 'expo-router';
import { HomeIcon, FolderIcon, SettingsIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const segments = useSegments();
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';
  const inactiveColor = colorScheme === 'dark' ? '#666' : '#999';

  // Determine if the tab bar should be visible based on the current route
  const hiddenRoutes = [
    '(tabs)/categories/new',
    '(tabs)/categories/[id]',
    '(tabs)/categories/[id]/[voiceId]',
  ];
  const currentRoute = segments.join('/');
  useEffect(() => {
    console.log('Current Route:', currentRoute);
    if (hiddenRoutes.includes(currentRoute)) {
      setIsTabBarVisible(false);
    } else {
      setIsTabBarVisible(true);
    }
  }, [currentRoute]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: isTabBarVisible ? 'flex' : 'none',
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          borderTopColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
        },
        tabBarActiveTintColor: iconColor,
        tabBarInactiveTintColor: inactiveColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories/index"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <FolderIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories/new"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="categories/[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="categories/[id]/[voiceId]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
