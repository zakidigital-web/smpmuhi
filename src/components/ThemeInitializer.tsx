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

function updateMeta(name: string, content: string) {
  const el = document.querySelector(`meta[name="${name}"]`);
  if (el) el.setAttribute("content", content);
}

export default function ThemeInitializer() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data || typeof data !== "object") return;
        applyColors(data as Record<string, string>);
        try {
          localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(data));
          localStorage.setItem("site_identity", JSON.stringify({
            schoolName: data.schoolName,
            shortName: data.shortName,
          }));
        } catch {}
        updateMeta("application-name", data.shortName || data.schoolName || "SMP Muhammadiyah 1 Genteng");
        updateMeta("apple-mobile-web-app-title", data.shortName || data.schoolName || "SMP Muhammadiyah 1 Genteng");
        if (data.primaryColor) updateMeta("theme-color", data.primaryColor);
      })
      .catch(() => {});
  }, []);

  return null;
}
