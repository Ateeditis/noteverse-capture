tsx
import React, { useState, useContext } from 'react';
import {
  MD3LightTheme,
  MD3DarkTheme,
  Provider,
  adaptNavigationTheme,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeType, setThemeType] = useState<ThemeType>('light');

  const toggleTheme = () => {
    setThemeType((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const paperTheme = themeType === 'light' ? MD3LightTheme : MD3DarkTheme;

  const navigationTheme =
    themeType === 'light' ? NavigationDefaultTheme : NavigationDarkTheme;

  const theme = merge(paperTheme, {
    navigation: navigationTheme,
  });

  const value: ThemeContextType = {
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <Provider theme={theme}>{children}</Provider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const paperTheme = usePaperTheme();
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return { ...context, theme: paperTheme };
};