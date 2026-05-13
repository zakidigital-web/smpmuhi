"use client";

import { useEffect } from "react";

const THEME_CACHE_KEY = "theme_colors";

function applyColors(data: Record<string, string>) {
  let style = document.getElementById("theme-style") as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = "theme-style";
    document.head.appendChild(style);
  }
  let css = "";
  if (data.primaryColor) css += "--primary:" + data.primaryColor + ";";
  if (data.secondaryColor) css += "--secondary:" + data.secondaryColor + ";";
  if (data.accentColor) css += "--accent:" + data.accentColor + ";";
  style.textContent = ":root{" + css + "}";
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
