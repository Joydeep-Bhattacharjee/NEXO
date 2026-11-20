"use client";

import { useMemo } from "react";
import { ZoneComposer } from "@/components/anon/ZoneComposer";
import { ZoneThreadCard } from "@/components/anon/ZoneThreadCard";
import { useAnonStore } from "@/lib/anon-store";
import { allThreads } from "@/lib/anon-threads";

/** Zone home: every Realm's threads in one stream, your own on top. */
export default function ZoneHomePage() {
  const posts = useAnonStore((s) => s.posts);
  const identities = useAnonStore((s) => s.identities);
  const threads = useMemo(() => allThreads(posts, identities), [posts, identities]);

  return (
    <div className="flex flex-col gap-4">
      <header className="pb-2">
        <h1 className="font-display text-[36px] font-bold leading-tight">All Realms</h1>
        <p className="mt-1 text-[14px] text-fg-muted">
          Say what you can&apos;t say on your main. Respect here is earned by the take, not the name
        </p>
      </header>
      <ZoneComposer />
      {threads.map((t) => (
        <ZoneThreadCard key={t.id} thread={t} showRealm />
      ))}
    </div>
  );
}
