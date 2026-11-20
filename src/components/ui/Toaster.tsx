"use client";

import { useEffect } from "react";
import { create } from "zustand";

interface ToastState {
  message: string | null;
  key: number;
  show: (message: string) => void;
  clear: () => void;
}

const TOAST_MS = 2800;

export const useToast = create<ToastState>((set) => ({
  message: null,
  key: 0,
  show: (message) => set((s) => ({ message, key: s.key + 1 })),
  clear: () => set({ message: null }),
}));

/** One short confirmation at a time, above the bottom tabs. */
export function Toaster() {
  const { message, key, clear } = useToast();

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(clear, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [message, key, clear]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex justify-center px-4 lg:bottom-8">
      {message && (
        <p
          key={key}
          className="card-rise max-w-md rounded-btn border border-line-hover bg-overlay px-4 py-2.5 text-[14px] text-fg shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {message}
        </p>
      )}
    </div>
  );
}
