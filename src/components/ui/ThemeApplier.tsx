"use client";

import { useEffect } from "react";
import { useAppHydration, useAppStore } from "@/lib/app-store";

/** Puts the chosen theme on <html> so the CSS tokens switch. */
export function ThemeApplier() {
  const isReady = useAppHydration();
  const theme = useAppStore((s) => s.theme);
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    if (!isReady) return;
    const root = document.documentElement;
    if (theme === "dark") delete root.dataset.theme;
    else root.dataset.theme = theme;
    root.lang = language === "EN" ? "en" : "bn";
  }, [isReady, theme, language]);

  return null;
}
