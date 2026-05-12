"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
