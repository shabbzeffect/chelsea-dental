'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedSettings = localStorage.getItem('clinic-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.darkMode) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        }
      } catch {
        // Ignore parse errors
      }
    } else {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedSettings = localStorage.getItem('clinic-settings');
      if (!savedSettings) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDark(false);
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
