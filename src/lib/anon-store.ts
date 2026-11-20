"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { newId, validateIdentityName, type GlyphKey } from "./anon-identity";

export interface AnonIdentity {
  id: string;
  name: string;
  hue: string;
  glyph: GlyphKey;
  createdAt: string;
}

export interface AnonPost {
  id: string;
  realmSlug: string;
  identityId: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface AnonReply {
  id: string;
  threadId: string;
  identityId: string;
  body: string;
  createdAt: string;
}

export const MAX_IDENTITIES = 5;
export const TITLE_MAX = 120;
export const BODY_MAX = 2000;

type IdentityDraft = Pick<AnonIdentity, "name" | "hue" | "glyph">;
type PostDraft = Pick<AnonPost, "realmSlug" | "title" | "body">;

interface AnonState {
  identities: AnonIdentity[];
  activeId: string | null;
  posts: AnonPost[];
  replies: AnonReply[];
  respected: string[];
  hasHydrated: boolean;
  toggleRespect: (id: string) => void;
  createIdentity: (draft: IdentityDraft) => AnonIdentity | null;
  switchIdentity: (id: string) => void;
  removeIdentity: (id: string) => void;
  addPost: (draft: PostDraft) => AnonPost | null;
  addReply: (threadId: string, body: string) => AnonReply | null;
}

/**
 * Anonymous zone state. Identities, posts and replies live only on this device
 * until a backend exists, and never reference the main account.
 */
export const useAnonStore = create<AnonState>()(
  persist(
    (set, get) => ({
      identities: [],
      activeId: null,
      posts: [],
      replies: [],
      respected: [],
      hasHydrated: false,

      toggleRespect: (id) => {
        const { respected } = get();
        set({ respected: respected.includes(id) ? respected.filter((r) => r !== id) : [...respected, id] });
      },

      createIdentity: (draft) => {
        const { identities } = get();
        if (identities.length >= MAX_IDENTITIES) return null;
        if (validateIdentityName(draft.name)) return null;
        const identity: AnonIdentity = {
          ...draft,
          name: draft.name.trim(),
          id: newId("id"),
          createdAt: new Date().toISOString(),
        };
        set({ identities: [...identities, identity], activeId: identity.id });
        return identity;
      },

      switchIdentity: (id) => {
        if (get().identities.some((i) => i.id === id)) set({ activeId: id });
      },

      removeIdentity: (id) => {
        const remaining = get().identities.filter((i) => i.id !== id);
        const activeId = get().activeId === id ? (remaining[0]?.id ?? null) : get().activeId;
        set({ identities: remaining, activeId });
      },

      addPost: (draft) => {
        const { activeId, posts } = get();
        const title = draft.title.trim();
        const body = draft.body.trim();
        if (!activeId || !title || title.length > TITLE_MAX || body.length > BODY_MAX) return null;
        const post: AnonPost = {
          ...draft,
          title,
          body,
          id: newId("post"),
          identityId: activeId,
          createdAt: new Date().toISOString(),
        };
        set({ posts: [post, ...posts] });
        return post;
      },

      addReply: (threadId, rawBody) => {
        const { activeId, replies } = get();
        const body = rawBody.trim();
        if (!activeId || !body || body.length > BODY_MAX) return null;
        const reply: AnonReply = {
          id: newId("reply"),
          threadId,
          identityId: activeId,
          body,
          createdAt: new Date().toISOString(),
        };
        set({ replies: [...replies, reply] });
        return reply;
      },
    }),
    {
      name: "nexo-anon-zone",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ identities, activeId, posts, replies, respected }) => ({ identities, activeId, posts, replies, respected }),
      onRehydrateStorage: () => () => {
        useAnonStore.setState({ hasHydrated: true });
      },
    },
  ),
);

export function useActiveIdentity(): AnonIdentity | undefined {
  return useAnonStore((s) => s.identities.find((i) => i.id === s.activeId));
}
