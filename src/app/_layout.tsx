import React, { createContext, useContext, useState } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export default function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});