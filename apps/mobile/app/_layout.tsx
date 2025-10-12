import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { initDatabase } from '@/lib/db';
import { hasCompletedOnboarding, getSyncMode } from '@/services/storage.service';
import { SplashScreen } from '@/components/splash-screen';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const onboardingComplete = await hasCompletedOnboarding();

        if (onboardingComplete) {
          const syncMode = await getSyncMode();

          if (syncMode === 'offline') {
            await initDatabase('offline');
          } else if (syncMode === 'online') {
            await initDatabase('online');
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <KeyboardProvider>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
      </ThemeProvider>
    </KeyboardProvider>
  );
}
