import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} });

// The class on <html> is set before first paint (index.html); this keeps React in step and saves the visitor's choice.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
  useEffect(() => {
    const r = document.documentElement;
    r.classList.toggle('dark', theme === 'dark'); r.classList.toggle('light', theme === 'light'); r.style.colorScheme = theme;
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => {
    const n = t === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', n); } catch { /* storage may be blocked */ }
    return n;
  }), []);
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
};
export const useTheme = () => useContext(Ctx);
