"use client";

import { Moon, Smartphone, Sun, type LucideIcon } from "lucide-react";
import { useAppHydration, useAppStore, type Theme } from "@/lib/app-store";

const THEMES: { key: Theme; label: string; icon: LucideIcon }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "amoled", label: "AMOLED black", icon: Smartphone },
];

/** Light, dark or AMOLED, bound to the saved appearance setting. */
export function ThemeSwitch() {
  const isReady = useAppHydration();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const current = isReady ? theme : "dark";

  return (
    <span className="flex rounded-btn bg-overlay p-0.5" role="radiogroup" aria-label="Appearance">
      {THEMES.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          role="radio"
          aria-checked={current === key}
          aria-label={label}
          title={label}
          onClick={() => setTheme(key)}
          className={`flex h-7 w-8 items-center justify-center rounded-[6px] transition-colors cursor-pointer ${
            current === key ? "bg-raised text-fg" : "text-fg-muted hover:text-fg"
          }`}
        >
          <Icon size={15} strokeWidth={1.5} aria-hidden />
        </button>
      ))}
    </span>
  );
}
