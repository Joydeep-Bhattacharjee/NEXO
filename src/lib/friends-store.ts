"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FriendStatus = "none" | "friends" | "sent" | "received";

interface FriendsState {
  friends: string[];
  sent: string[];
  received: string[];
  hasHydrated: boolean;
  sendRequest: (userId: string) => void;
  cancelRequest: (userId: string) => void;
  accept: (userId: string) => void;
  decline: (userId: string) => void;
  unfriend: (userId: string) => void;
}

const without = (list: string[], id: string) => list.filter((x) => x !== id);

/** Mutual friendships for the main profile. Saved on this device until a backend exists. */
export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      friends: ["u3", "u4"],
      sent: [],
      received: ["u1"],
      hasHydrated: false,
      sendRequest: (id) => {
        const { friends, sent, received } = get();
        if (friends.includes(id) || sent.includes(id)) return;
        if (received.includes(id)) {
          set({ friends: [...friends, id], received: without(received, id) });
          return;
        }
        set({ sent: [...sent, id] });
      },
      cancelRequest: (id) => set({ sent: without(get().sent, id) }),
      accept: (id) => {
        const { friends, received } = get();
        if (!received.includes(id)) return;
        set({ friends: [...friends, id], received: without(received, id) });
      },
      decline: (id) => set({ received: without(get().received, id) }),
      unfriend: (id) => set({ friends: without(get().friends, id) }),
    }),
    {
      name: "nexo-friends",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ friends, sent, received }) => ({ friends, sent, received }),
      onRehydrateStorage: () => () => {
        useFriendsStore.setState({ hasHydrated: true });
      },
    },
  ),
);

/** Loads saved friendships once on the client. Call it in any component that reads the store. */
export function useFriendsHydration(): boolean {
  const hasHydrated = useFriendsStore((s) => s.hasHydrated);
  useEffect(() => {
    if (!useFriendsStore.persist.hasHydrated()) useFriendsStore.persist.rehydrate();
  }, []);
  return hasHydrated;
}

export function useFriendStatus(userId: string): FriendStatus {
  return useFriendsStore((s) => {
    if (s.friends.includes(userId)) return "friends";
    if (s.sent.includes(userId)) return "sent";
    if (s.received.includes(userId)) return "received";
    return "none";
  });
}
