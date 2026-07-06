"use client";

import { useIdentityStore } from "@/lib/store";

/**
 * Persistent Mask-mode banner (§3.7): purple strip so users always know
 * which identity is active inside a Realm.
 */
export function MaskBanner({ realmSlug }: { realmSlug: string }) {
  const isAnonymous = useIdentityStore((s) => s.isAnonymous);
  const toggleAnonymous = useIdentityStore((s) => s.toggleAnonymous);
  const mask = useIdentityStore((s) => s.maskFor)(realmSlug);

  if (!isAnonymous) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-mask px-4 py-1.5 text-[13px] font-medium text-white"
    >
      <span className="truncate">
        🎭 You are {mask?.displayName ?? "a new Mask"} — anonymous in this Realm
      </span>
      <button
        onClick={toggleAnonymous}
        className="shrink-0 rounded-full border border-white/40 px-2.5 py-0.5 text-[12px] transition-colors hover:bg-white/15 cursor-pointer"
      >
        Exit
      </button>
    </div>
  );
}
