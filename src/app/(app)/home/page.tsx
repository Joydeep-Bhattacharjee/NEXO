"use client";

import { useState } from "react";
import { FeedCard } from "@/components/feed/FeedCard";
import { Chip } from "@/components/ui/Chip";
import { FEED_POSTS, GAMES } from "@/lib/mock-data";

const FILTERS = ["All", "Clips", "Following"] as const;

export default function HomePage() {
  const [filter, setFilter] = useState<string>("All");
  const [game, setGame] = useState<string | null>(null);

  const posts = FEED_POSTS.filter((p) => {
    if (filter === "Clips" && p.kind !== "clip") return false;
    if (game && p.game !== game) return false;
    return true;
  });

  return (
    <div className="flex max-w-[680px] flex-col gap-4">
      {/* filter chips */}
      <div className="rail-scroll flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Feed filters">
        {FILTERS.map((f) => (
          <Chip key={f} isActive={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <span className="mx-1 w-px shrink-0 bg-line" aria-hidden />
        {GAMES.slice(0, 6).map((g) => (
          <Chip
            key={g.id}
            isActive={game === g.name}
            onClick={() => setGame(game === g.name ? null : g.name)}
          >
            {g.cover} {g.name}
          </Chip>
        ))}
      </div>

      {posts.map((p) => (
        <FeedCard key={p.id} post={p} />
      ))}
      {posts.length === 0 && (
        <p className="py-12 text-center text-fg-muted">Nothing here yet. Try another filter.</p>
      )}
    </div>
  );
}
