"use client";

import { useAppHydration, useAppStore, type Language } from "@/lib/app-store";

const LANGUAGES: Language[] = ["EN", "বাংলা"];

/** EN / বাংলা toggle bound to the saved language setting. */
export function LanguageSwitch({ size = "sm" }: { size?: "sm" | "md" }) {
  const isReady = useAppHydration();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const current = isReady ? language : "EN";
  const height = size === "md" ? "h-7 px-2.5" : "h-6 px-2";

  return (
    <span className="flex rounded-btn bg-overlay p-0.5" role="radiogroup" aria-label="Language">
      {LANGUAGES.map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={current === l}
          onClick={() => setLanguage(l)}
          className={`${height} rounded-[6px] text-[12px] transition-colors cursor-pointer ${
            current === l ? "bg-raised text-fg" : "text-fg-muted hover:text-fg"
          }`}
        >
          {l}
        </button>
      ))}
    </span>
  );
}
