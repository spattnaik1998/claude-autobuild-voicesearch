'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Hook to manage theme state and persistence
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = saved || preferred;

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setIsMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme, isMounted };
};

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

/**
 * Initialize theme immediately (prevents FOUC - Flash of Unstyled Content)
 * Call this in your layout's head or in a script tag
 */
export const initializeTheme = () => {
  if (typeof window === 'undefined') return;

  try {
    const saved = localStorage.getItem('theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = saved || preferred;
    applyTheme(theme);
  } catch {
    applyTheme('light');
  }
};
