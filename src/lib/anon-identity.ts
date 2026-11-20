/** Building blocks for anonymous identities: names, colors and glyphs. Nothing here touches the main profile. */

/** Earthy, low-saturation inks: bone, ember, brass, sage, rose, verdigris. */
export const IDENTITY_HUES = [
  "#e2d9c6",
  "#d9774b",
  "#c9a24a",
  "#8fb07f",
  "#c77a84",
  "#6fa39d",
] as const;

export const GLYPH_KEYS = ["mask", "ghost", "moon", "eye", "feather", "orbit"] as const;
export type GlyphKey = (typeof GLYPH_KEYS)[number];

export const NAME_MIN = 3;
export const NAME_MAX = 24;

const ADJECTIVES = [
  "Quiet", "Hollow", "Velvet", "Ashen", "Drifting", "Lucky", "Midnight", "Paper",
  "Static", "Rusty", "Salt", "Low-key", "Sleepy", "Crooked", "Monsoon", "Faded",
] as const;

const NOUNS = [
  "Lotus", "Heron", "Comet", "Tiger", "Kite", "Ember", "Falcon", "Sparrow",
  "Ferry", "Lantern", "Rickshaw", "Cobra", "Pixel", "Tide", "Moth", "Signal",
] as const;

export function pickRandom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomIdentityName(): string {
  const number = 10 + Math.floor(Math.random() * 90);
  return `${pickRandom(ADJECTIVES)} ${pickRandom(NOUNS)} ${number}`;
}

/** Returns an error message, or null when the name is usable. */
export function validateIdentityName(raw: string): string | null {
  const name = raw.trim();
  if (name.length < NAME_MIN) return `Use at least ${NAME_MIN} characters`;
  if (name.length > NAME_MAX) return `Keep it under ${NAME_MAX + 1} characters`;
  if (!/^[\p{L}\p{N} _.-]+$/u.test(name)) return "Letters, numbers, spaces, dots and dashes only";
  return null;
}

/** Stable color for identities we did not create ourselves, like other people's Masks in mock data. */
export function hueFor(name: string): string {
  const hash = [...name].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return IDENTITY_HUES[hash % IDENTITY_HUES.length];
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
