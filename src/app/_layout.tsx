import { Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
    } as any),
  });
}

export default function RootLayout() {
  const appState = useRef<any>(AppState.currentState);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Notifications.requestPermissionsAsync();

      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (appState.current && appState.current.match(/inactive|background/) && nextAppState === 'active') {
          triggerRecoveryNotification();
        }
        appState.current = nextAppState;
      });

      return () => subscription.remove();
    }
  }, []);

  const triggerRecoveryNotification = async () => {
    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Welcome Back to REHAB 💪",
          body: "Stay strong on your recovery journey today!",
        },
        trigger: null,
      });
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}