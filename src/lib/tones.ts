/** Content tones: avatars, server marks and clip thumbnails carry the color, chrome stays neutral. */

/** Muted pigments that sit on the monsoon-night ground: moss, clay, river, brick, jute, slate-teal. */
const AVATAR_TINTS = [
  "#355047",
  "#5a4330",
  "#2f4a55",
  "#5a3436",
  "#4f4a2c",
  "#3a4f4a",
] as const;

/** Per-game light for clip and stream thumbnails, close to each game's own palette. */
const GAME_TONES: Record<string, string> = {
  Valorant: "#ff4655",
  "Free Fire": "#f5a524",
  "Clash of Clans": "#e8b923",
  "PUBG / BGMI": "#c9a86a",
  "Pokémon GO": "#4d8dff",
  Minecraft: "#6cbf4a",
  eFootball: "#3ddc97",
  "Call of Duty Mobile": "#d9822b",
  "Mobile Legends": "#7c8cff",
};

const DEFAULT_TONE = "#96a0ae";

/** Skipped when building monograms, so "Clash of Clans BD" reads CC, not CO. */
const STOP_WORDS = new Set(["of", "the", "and", "a", "an"]);

function hash(value: string): number {
  return [...value].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
}

export function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()));
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function avatarTint(name: string): string {
  return AVATAR_TINTS[hash(name) % AVATAR_TINTS.length];
}

export function gameTone(game: string): string {
  return GAME_TONES[game] ?? DEFAULT_TONE;
}
