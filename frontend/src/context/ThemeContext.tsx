import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window === 'undefined') {
        return 'light';
      }

      const savedTheme = window.localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;

      if (typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      window.localStorage.setItem('theme', theme);
    } catch {
      // Ignore theme persistence errors in non-browser environments
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Safe fallback: read and toggle theme directly on the document element
    const getCurrentTheme = (): Theme => {
      if (typeof window === 'undefined') return 'light';
      const root = window.document.documentElement;
      return root.classList.contains('dark') ? 'dark' : 'light';
    };

    const fallbackToggle = () => {
      try {
        if (typeof window === 'undefined') return;
        const root = window.document.documentElement;
        const isDark = root.classList.contains('dark');
        const nextTheme: Theme = isDark ? 'light' : 'dark';

        root.classList.remove('light', 'dark');
        root.classList.add(nextTheme);
        window.localStorage.setItem('theme', nextTheme);
      } catch {
        // Ignore DOM/storage errors in non-browser environments
      }
    };

    return {
      theme: getCurrentTheme(),
      toggleTheme: fallbackToggle,
    };
  }
  return context;
};
