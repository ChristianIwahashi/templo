import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Verifica se o usuário já salvou alguma preferência antes no navegador
    const savedTheme = localStorage.getItem('@Templo:theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('@Templo:theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('@Templo:theme', 'light');
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}