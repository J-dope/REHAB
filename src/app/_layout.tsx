import React, { createContext, useContext, useState } from 'react';
import { Stack } from 'expo-router';

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
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeContext.Provider>
  );
}