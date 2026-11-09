import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/store/auth';
import { DataProvider, useData } from '@/store/data';
import '@/utils/web-alert';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const { isReady: dataReady } = useData();
  const isLoading = authLoading || !dataReady;

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  // Keep the splash screen up while the saved session and demo data load.
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="chat/[threadId]"
          options={{
            headerShown: true,
            title: 'Message',
            headerStyle: { backgroundColor: Colors.header },
            headerTintColor: Colors.white,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </DataProvider>
    </AuthProvider>
  );
}
