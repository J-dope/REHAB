import { Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import React from 'react';

// Conditional import to prevent web crashes
let Notifications: any = null;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
    }),
  });
}

export default function RootLayout() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (Platform.OS !== 'web' && Notifications) {
      Notifications.requestPermissionsAsync();

      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          triggerRecoveryNotification();
        }
        appState.current = nextAppState;
      });

      return () => subscription.remove();
    }
  }, []);

  const triggerRecoveryNotification = async () => {
    if (Platform.OS !== 'web' && Notifications) {
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