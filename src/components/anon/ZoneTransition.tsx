"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { VenetianMask } from "lucide-react";
import { create } from "zustand";

type Tone = "anon" | "main";
type Phase = "idle" | "expanding" | "covering" | "revealing";

interface TransitionState {
  phase: Phase;
  x: number;
  y: number;
  target: string;
  tone: Tone;
  start: (x: number, y: number, target: string, tone: Tone) => void;
  setPhase: (phase: Phase) => void;
}

const useTransition = create<TransitionState>((set) => ({
  phase: "idle",
  x: 0,
  y: 0,
  target: "/",
  tone: "anon",
  start: (x, y, target, tone) => set({ phase: "expanding", x, y, target, tone }),
  setPhase: (phase) => set({ phase }),
}));

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EXPAND_MS = 560;
const REVEAL_MS = 240;
const SAFETY_MS = 5000;

const TONE_BG: Record<Tone, string> = {
  anon: "#0c0b0a",
  main: "#0e1116",
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Navigate with a circle that grows out of the clicked control and covers the screen. */
export function useZoneNavigate() {
  const router = useRouter();
  const start = useTransition((s) => s.start);

  return (event: MouseEvent<HTMLElement>, target: string, tone: Tone) => {
    event.preventDefault();
    if (prefersReducedMotion()) {
      router.push(target);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    start(rect.left + rect.width / 2, rect.top + rect.height / 2, target, tone);
  };
}

/** Mounted once in the root layout so the circle survives the route change underneath it. */
export function ZoneTransitionLayer() {
  const { phase, x, y, target, tone, setPhase } = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (phase !== "expanding" || !el) return;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const animation = el.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
      ],
      { duration: EXPAND_MS, easing: EASE, fill: "forwards" },
    );
    animation.finished
      .then(() => {
        setPhase("covering");
        router.push(target);
      })
      .catch(() => setPhase("idle"));
    return () => animation.cancel();
  }, [phase, x, y, target, router, setPhase]);

  useEffect(() => {
    if (phase !== "covering") return;
    if (pathname === target || pathname.startsWith(`${target}/`)) {
      setPhase("revealing");
      return;
    }
    const timer = window.setTimeout(() => setPhase("revealing"), SAFETY_MS);
    return () => window.clearTimeout(timer);
  }, [phase, pathname, target, setPhase]);

  useEffect(() => {
    const el = layerRef.current;
    if (phase !== "revealing" || !el) return;
    const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: REVEAL_MS,
      easing: EASE,
      fill: "forwards",
    });
    animation.finished.then(() => setPhase("idle")).catch(() => setPhase("idle"));
    return () => animation.cancel();
  }, [phase, setPhase]);

  if (phase === "idle") return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: TONE_BG[tone],
        clipPath: phase === "expanding" ? `circle(0px at ${x}px ${y}px)` : undefined,
      }}
    >
      {tone === "anon" && (
        <VenetianMask size={40} strokeWidth={1.25} className="zone-glyph text-[#e2d9c6]" />
      )}
    </div>
  );
}
