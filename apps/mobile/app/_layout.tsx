import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { initDatabase } from '@/lib/db';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { hasCompletedOnboarding, getSyncMode } from '@/services/storage.service';
import { SplashScreen } from '@/components/splash-screen';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { KeyboardProvider, KeyboardStickyView } from "react-native-keyboard-controller";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Stack } from 'expo-router';
import { Toaster } from 'sonner-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient()
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Provide the client to your App */}
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }} />
            <KeyboardStickyView>
              <PortalHost />
            </KeyboardStickyView>
            <Toaster />
          </ThemeProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}