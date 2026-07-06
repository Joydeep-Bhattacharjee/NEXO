"use client";

import { useIdentityStore } from "@/lib/store";

/** Go Anonymous header switch (§2.3): one tap flips the session into Mask mode. */
export function AnonToggle() {
  const isAnonymous = useIdentityStore((s) => s.isAnonymous);
  const toggleAnonymous = useIdentityStore((s) => s.toggleAnonymous);

  return (
    <button
      role="switch"
      aria-checked={isAnonymous}
      aria-label="Go Anonymous"
      onClick={toggleAnonymous}
      className={`flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors duration-150 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mask ${
        isAnonymous
          ? "border-mask bg-mask/15 text-mask"
          : "border-line text-fg-muted hover:border-line-hover hover:text-fg"
      }`}
    >
      <span aria-hidden>🎭</span>
      <span className="hidden sm:inline">{isAnonymous ? "Anonymous" : "Go Anonymous"}</span>
      <span
        aria-hidden
        className={`relative h-4 w-7 rounded-full transition-colors duration-150 ${
          isAnonymous ? "bg-mask" : "bg-overlay"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform duration-150 ease-out ${
            isAnonymous ? "translate-x-3.5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
