"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { newId } from "./anon-identity";
import { DMS, SERVERS, type Post } from "./mock-data";

export type ReactionKey = keyof Post["reactions"];
export type Theme = "dark" | "light" | "amoled";
export type Language = "EN" | "বাংলা";

export interface ChatLine {
  id: string;
  author: string;
  body: string;
  time: string;
  isMine: boolean;
}

export interface PostComment {
  id: string;
  body: string;
  createdAt: string;
}

export const TEXT_MAX = 2000;
export const RECENT_MAX = 8;

/** Shared empty list for selectors. A fresh [] per call makes zustand re-render forever. */
export const EMPTY_LINES: readonly ChatLine[] = [];
export const EMPTY_COMMENTS: readonly PostComment[] = [];

type PostDraft = Omit<Post, "id" | "postedAt" | "reactions" | "comments" | "authorType">;

interface AppData {
  reactions: Record<string, ReactionKey>;
  saved: string[];
  comments: Record<string, PostComment[]>;
  myPosts: Post[];
  joined: Record<string, boolean>;
  channelMessages: Record<string, ChatLine[]>;
  dmThreads: Record<string, ChatLine[]>;
  follows: string[];
  theme: Theme;
  language: Language;
  twoFactor: boolean;
  push: boolean;
  recentSearches: string[];
  myPhoto: string | null;
}

interface AppState extends AppData {
  hasHydrated: boolean;
  react: (postId: string, key: ReactionKey) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, body: string) => boolean;
  addPost: (draft: PostDraft) => Post | null;
  setJoined: (slug: string, isJoined: boolean) => void;
  sendChannel: (key: string, body: string) => boolean;
  sendDm: (threadId: string, body: string) => boolean;
  toggleFollow: (handle: string) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setTwoFactor: (on: boolean) => void;
  setPush: (on: boolean) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setMyPhoto: (dataUrl: string | null) => void;
}

function clean(body: string): string | null {
  const text = body.trim();
  return text && text.length <= TEXT_MAX ? text : null;
}

function nowTime(): string {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function myLine(body: string): ChatLine {
  return { id: newId("msg"), author: "Shadow Striker", body, time: nowTime(), isMine: true };
}

const SEED_DMS: Record<string, ChatLine[]> = Object.fromEntries(
  DMS.map((d) => [d.id, [{ id: `${d.id}-seed`, author: d.with, body: d.lastMessage, time: d.time, isMine: false }]]),
);

/** Everything a viewer does in the main app. Saved on this device until a backend exists. */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      reactions: {},
      saved: [],
      comments: {},
      myPosts: [],
      joined: Object.fromEntries(SERVERS.map((s) => [s.slug, s.joined])),
      channelMessages: {},
      dmThreads: SEED_DMS,
      follows: [],
      theme: "dark",
      language: "EN",
      twoFactor: false,
      push: true,
      recentSearches: [],
      myPhoto: null,

      react: (postId, key) => {
        const { [postId]: current, ...rest } = get().reactions;
        set({ reactions: current === key ? rest : { ...rest, [postId]: key } });
      },
      toggleSave: (postId) => {
        const { saved } = get();
        set({ saved: saved.includes(postId) ? saved.filter((id) => id !== postId) : [...saved, postId] });
      },
      addComment: (postId, body) => {
        const text = clean(body);
        if (!text) return false;
        const list = get().comments[postId] ?? [];
        const comment: PostComment = { id: newId("c"), body: text, createdAt: new Date().toISOString() };
        set({ comments: { ...get().comments, [postId]: [...list, comment] } });
        return true;
      },
      addPost: (draft) => {
        const body = clean(draft.body);
        if (!body) return null;
        const post: Post = {
          ...draft,
          body,
          id: newId("p"),
          authorType: "user",
          postedAt: new Date().toISOString(),
          reactions: { gg: 0, skull: 0, lol: 0, brain: 0 },
          comments: 0,
        };
        set({ myPosts: [post, ...get().myPosts] });
        return post;
      },
      setJoined: (slug, isJoined) => set({ joined: { ...get().joined, [slug]: isJoined } }),
      sendChannel: (key, body) => {
        const text = clean(body);
        if (!text) return false;
        const list = get().channelMessages[key] ?? [];
        set({ channelMessages: { ...get().channelMessages, [key]: [...list, myLine(text)] } });
        return true;
      },
      sendDm: (threadId, body) => {
        const text = clean(body);
        if (!text) return false;
        const list = get().dmThreads[threadId] ?? [];
        set({ dmThreads: { ...get().dmThreads, [threadId]: [...list, myLine(text)] } });
        return true;
      },
      toggleFollow: (handle) => {
        const { follows } = get();
        set({ follows: follows.includes(handle) ? follows.filter((h) => h !== handle) : [...follows, handle] });
      },
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTwoFactor: (twoFactor) => set({ twoFactor }),
      setPush: (push) => set({ push }),
      addRecentSearch: (query) => {
        const q = query.trim().slice(0, 80);
        if (!q) return;
        const rest = get().recentSearches.filter((r) => r.toLowerCase() !== q.toLowerCase());
        set({ recentSearches: [q, ...rest].slice(0, RECENT_MAX) });
      },
      removeRecentSearch: (query) => set({ recentSearches: get().recentSearches.filter((r) => r !== query) }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setMyPhoto: (myPhoto) => set({ myPhoto }),
    }),
    {
      name: "nexo-app",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): AppData => ({
        reactions: s.reactions,
        saved: s.saved,
        comments: s.comments,
        myPosts: s.myPosts,
        joined: s.joined,
        channelMessages: s.channelMessages,
        dmThreads: s.dmThreads,
        follows: s.follows,
        theme: s.theme,
        language: s.language,
        twoFactor: s.twoFactor,
        push: s.push,
        recentSearches: s.recentSearches,
        myPhoto: s.myPhoto,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hasHydrated: true });
      },
    },
  ),
);

/** Loads saved activity once on the client. Returns false until it has. */
export function useAppHydration(): boolean {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  useEffect(() => {
    if (!useAppStore.persist.hasHydrated()) useAppStore.persist.rehydrate();
  }, []);
  return hasHydrated;
}
