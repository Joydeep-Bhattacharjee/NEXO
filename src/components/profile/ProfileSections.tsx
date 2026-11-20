"use client";

import Link from "next/link";
import { useState } from "react";
import { Users } from "lucide-react";
import { FeedCard } from "@/components/feed/FeedCard";
import { FriendsPanel } from "@/components/friends/FriendsPanel";
import { useFriendsHydration, useFriendsStore } from "@/lib/friends-store";
import { ClipThumb } from "@/components/media/ClipThumb";
import { ServerMark } from "@/components/ui/ServerMark";
import { formatCount, type Post, type Server } from "@/lib/mock-data";

type Tab = "clips" | "posts" | "servers" | "friends";

type Props = {
  clips: Post[];
  posts: Post[];
  servers: Server[];
  isOwn: boolean;
};

const TABS: { key: Exclude<Tab, "friends">; label: string }[] = [
  { key: "clips", label: "Clips" },
  { key: "posts", label: "Posts" },
  { key: "servers", label: "Servers" },
];

function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-[14px] text-fg-muted">{text}</p>;
}

/** Profile tabs: Clips, Posts and Servers for everyone. Your own profile adds a friends icon. */
export function ProfileSections({ clips, posts, servers, isOwn }: Props) {
  const [tab, setTab] = useState<Tab>("clips");
  const isReady = useFriendsHydration();
  const pending = useFriendsStore((s) => s.received.length);
  const requestCount = isOwn && isReady ? pending : 0;
  const tabClass = (isActive: boolean) =>
    `flex h-11 items-center justify-center gap-2 text-[14px] transition-colors cursor-pointer border-b-2 ${
      isActive ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg"
    }`;

  return (
    <>
      <div role="tablist" aria-label="Profile sections" className="flex border-b border-line">
        <div className="grid flex-1 grid-cols-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={tabClass(tab === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {isOwn && (
          <button
            role="tab"
            aria-selected={tab === "friends"}
            aria-label={requestCount > 0 ? `Friends, ${requestCount} new requests` : "Friends"}
            title="Friends"
            onClick={() => setTab("friends")}
            className={`${tabClass(tab === "friends")} relative w-14`}
          >
            <Users size={18} strokeWidth={1.5} aria-hidden />
            {requestCount > 0 && (
              <span className="absolute right-2 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 font-mono text-[10px] leading-none text-white">
                {requestCount}
              </span>
            )}
          </button>
        )}
      </div>

      {tab === "clips" &&
        (clips.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {clips.map((c) => (
              <li key={c.id}>
                <Link href={`/clip/${c.id}`} className="group block">
                  <ClipThumb game={c.game} meta={`${formatCount(c.views ?? 0)} views`} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty text="No clips yet" />
        ))}

      {tab === "posts" &&
        (posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((p) => (
              <FeedCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <Empty text="No posts yet" />
        ))}

      {tab === "servers" &&
        (servers.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {servers.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/s/${s.slug}`}
                  className="flex items-center gap-3 rounded-card border border-line bg-raised p-4 transition-colors hover:border-line-hover"
                >
                  <ServerMark name={s.name} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium">{s.name}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">
                      {formatCount(s.members)} members · {formatCount(s.online)} online
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty text="Not in any servers yet" />
        ))}

      {tab === "friends" && isOwn && <FriendsPanel />}
    </>
  );
}
