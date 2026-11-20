import { hueFor, type GlyphKey } from "./anon-identity";
import type { AnonIdentity, AnonPost, AnonReply } from "./anon-store";
import { MOCK_NOW, REALM_THREADS, REALMS, THREAD_COMMENTS, type Realm } from "./mock-data";

export interface ZoneThread {
  id: string;
  realmSlug: string;
  authorName: string;
  authorHue: string;
  authorGlyph: GlyphKey;
  badge?: string;
  title: string;
  body: string;
  respect: number;
  comments: number;
  postedAt: string;
  kind: "text" | "poll" | "raid";
  expiresIn?: string;
  summary?: string;
  isYours: boolean;
}

export interface ZoneComment {
  id: string;
  authorName: string;
  authorHue: string;
  authorGlyph: GlyphKey;
  badge?: string;
  body: string;
  respect: number;
  depth: number;
  postedAt: string;
  isYours: boolean;
}

const REMOVED = { name: "Retired identity", hue: "#7a746a", glyph: "mask" as GlyphKey };

function authorOf(identityId: string, identities: AnonIdentity[]) {
  const found = identities.find((i) => i.id === identityId);
  return found ? { name: found.name, hue: found.hue, glyph: found.glyph } : REMOVED;
}

export function realmBySlug(slug: string): Realm | undefined {
  return REALMS.find((r) => r.slug === slug);
}

/** Realm names drop the hyphens so they read as places, not URLs. */
export function realmLabel(slugOrName: string): string {
  const realm = realmBySlug(slugOrName);
  return (realm?.name ?? slugOrName).replace(/-/g, " ");
}

export function mockThreads(): ZoneThread[] {
  return REALM_THREADS.map((t) => ({
    id: t.id,
    realmSlug: t.realmSlug,
    authorName: t.maskName,
    authorHue: hueFor(t.maskName),
    authorGlyph: "mask",
    badge: t.maskBadge?.replace(/^✓\s*/, ""),
    title: t.title.replace(/^\[ARCHIVED RAID\]\s*/, ""),
    body: t.body,
    respect: t.respect,
    comments: t.comments,
    postedAt: t.postedAt,
    kind: t.type,
    expiresIn: t.aiSummary ? undefined : t.expiresIn,
    summary: t.aiSummary,
    isYours: false,
  }));
}

export function localThreads(posts: AnonPost[], identities: AnonIdentity[]): ZoneThread[] {
  return posts.map((p) => {
    const author = authorOf(p.identityId, identities);
    return {
      id: p.id,
      realmSlug: p.realmSlug,
      authorName: author.name,
      authorHue: author.hue,
      authorGlyph: author.glyph,
      title: p.title,
      body: p.body,
      respect: 0,
      comments: 0,
      postedAt: p.createdAt,
      kind: "text",
      isYours: true,
    };
  });
}

export function allThreads(posts: AnonPost[], identities: AnonIdentity[]): ZoneThread[] {
  return [...localThreads(posts, identities), ...mockThreads()];
}

export function commentsFor(
  thread: ZoneThread,
  replies: AnonReply[],
  identities: AnonIdentity[],
): ZoneComment[] {
  const seeded: ZoneComment[] = thread.isYours
    ? []
    : THREAD_COMMENTS.map((c) => ({
        id: c.id,
        authorName: c.maskName,
        authorHue: hueFor(c.maskName),
        authorGlyph: "mask",
        badge: c.maskBadge?.replace(/^✓\s*/, ""),
        body: c.body,
        respect: c.respect,
        depth: Math.min(c.depth, 4),
        postedAt: c.postedAt,
        isYours: false,
      }));
  const yours: ZoneComment[] = replies
    .filter((r) => r.threadId === thread.id)
    .map((r) => {
      const author = authorOf(r.identityId, identities);
      return {
        id: r.id,
        authorName: author.name,
        authorHue: author.hue,
        authorGlyph: author.glyph,
        body: r.body,
        respect: 0,
        depth: 0,
        postedAt: r.createdAt,
        isYours: true,
      };
    });
  return [...seeded, ...yours];
}

/** Relative time. Seeded content is measured against the frozen mock clock, your own posts against now. */
export function zoneTimeAgo(iso: string, isYours: boolean): string {
  const now = isYours ? Date.now() : Date.parse(MOCK_NOW);
  const mins = Math.max(1, Math.floor((now - Date.parse(iso)) / 60000));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
