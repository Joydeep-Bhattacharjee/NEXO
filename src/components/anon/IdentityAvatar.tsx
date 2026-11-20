import { Eye, Feather, Ghost, Moon, Orbit, VenetianMask, type LucideIcon } from "lucide-react";
import type { GlyphKey } from "@/lib/anon-identity";

export const GLYPHS: Record<GlyphKey, LucideIcon> = {
  mask: VenetianMask,
  ghost: Ghost,
  moon: Moon,
  eye: Eye,
  feather: Feather,
  orbit: Orbit,
};

type Props = {
  hue: string;
  glyph: GlyphKey;
  size?: number;
  label?: string;
  isActive?: boolean;
};

/** An anonymous identity's face: its glyph in its own color, never initials or a photo. */
export function IdentityAvatar({ hue, glyph, size = 36, label, isActive }: Props) {
  const Icon = GLYPHS[glyph];
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        color: hue,
        backgroundColor: `color-mix(in oklab, ${hue} 16%, transparent)`,
        boxShadow: isActive
          ? `0 0 0 2px var(--bg-base), 0 0 0 4px ${hue}`
          : `inset 0 0 0 1px color-mix(in oklab, ${hue} 30%, transparent)`,
      }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.5} aria-hidden />
    </span>
  );
}
