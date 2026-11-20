"use client";

import { FeedCard } from "@/components/feed/FeedCard";
import { useAppHydration, useAppStore } from "@/lib/app-store";
import { PUBLIC_POSTS } from "@/lib/mock-data";

/** Your own new posts on top, then everyone else's public posts. */
export function HomeFeed() {
  const isReady = useAppHydration();
  const myPosts = useAppStore((s) => s.myPosts);
  const posts = isReady ? [...myPosts, ...PUBLIC_POSTS] : PUBLIC_POSTS;
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col border-t border-line">
      {posts.map((p) => (
        <FeedCard key={p.id} post={p} />
      ))}
    </div>
  );
}
