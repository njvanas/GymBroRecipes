import React, { createContext, useContext, useEffect } from 'react';
import { useRecipeStore } from '../store/recipeStore';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useRecipeStore();

  useEffect(() => {
    // Set initial theme to dark
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme || 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme: theme || 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);