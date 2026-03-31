import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { shouldUseRemoteApi } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';

export default function RootLayout() {
  const bootstrap = useAppStore((state) => state.bootstrap);

  useEffect(() => {
    if (!shouldUseRemoteApi()) {
      return;
    }

    void bootstrap();
  }, [bootstrap]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="task-editor" options={{ presentation: 'modal' }} />
        <Stack.Screen name="check-in" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="overuse-intervention"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="monitoring-info"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaProvider>
  );
}
