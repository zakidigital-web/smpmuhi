"use client";

import { useEffect } from "react";

const THEME_CACHE_KEY = "theme_colors";

function applyColors(data: Record<string, string>) {
  const root = document.documentElement;
  if (data.primaryColor) root.style.setProperty("--primary", data.primaryColor);
  if (data.secondaryColor) root.style.setProperty("--secondary", data.secondaryColor);
  if (data.accentColor) root.style.setProperty("--accent", data.accentColor);
}

export default function ThemeInitializer() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data || typeof data !== "object") return;
        applyColors(data as Record<string, string>);
        try { localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(data)); } catch {}
      })
      .catch(() => {});
  }, []);

  return null;
}

export function getCachedTheme(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(THEME_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
