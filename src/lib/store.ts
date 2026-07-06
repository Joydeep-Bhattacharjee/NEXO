"use client";

import { create } from "zustand";
import { MY_MASKS, type Mask } from "./mock-data";

interface IdentityState {
  isAnonymous: boolean;
  toggleAnonymous: () => void;
  maskFor: (realmSlug: string) => Mask | undefined;
}

/**
 * Go Anonymous session state (§2.3). Flips the whole session into Mask
 * mode in place — no logout, no second account.
 */
export const useIdentityStore = create<IdentityState>((set, get) => ({
  isAnonymous: false,
  toggleAnonymous: () => set({ isAnonymous: !get().isAnonymous }),
  maskFor: (realmSlug: string) =>
    MY_MASKS.find((m) => m.realmSlug === realmSlug),
}));
