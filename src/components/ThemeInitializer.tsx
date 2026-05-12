"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data || typeof data !== "object") return;
        const root = document.documentElement;
        if (data.primaryColor) root.style.setProperty("--primary", data.primaryColor);
        if (data.secondaryColor) root.style.setProperty("--secondary", data.secondaryColor);
        if (data.accentColor) root.style.setProperty("--accent", data.accentColor);
      })
      .catch(() => {});
  }, []);

  return null;
}
