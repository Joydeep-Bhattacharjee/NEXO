"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipThumb } from "@/components/media/ClipThumb";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { formatCount, getUser, PUBLIC_POSTS, STREAMS } from "@/lib/mock-data";

const CLIPS = PUBLIC_POSTS.filter((p) => p.kind === "clip");

function durationOf(label?: string): string | undefined {
  return label?.split("·")[1]?.trim();
}

/** Videos: live streams first, then clips, filterable by game. */
export default function VideosPage() {
  const games = [...new Set([...STREAMS.map((s) => s.game), ...CLIPS.map((c) => c.game)])];
  const [game, setGame] = useState<string | null>(null);
  const streams = game ? STREAMS.filter((s) => s.game === game) : STREAMS;
  const clips = game ? CLIPS.filter((c) => c.game === game) : CLIPS;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[36px] font-bold leading-tight">Videos</h1>
        <div className="rail-scroll mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Games">
          {games.map((g) => (
            <Chip key={g} isActive={game === g} onClick={() => setGame(game === g ? null : g)}>
              {g}
            </Chip>
          ))}
        </div>
      </header>

      {streams.length > 0 && (
        <section aria-labelledby="live-heading">
          <h2 id="live-heading" className="flex items-center gap-2 text-[15px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden />
            Live now
          </h2>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {streams.map((st) => (
              <li key={st.id}>
                <Link href={`/live/${st.streamerHandle}`} className="group block">
                  <ClipThumb game={st.game} isLive meta={`${formatCount(st.viewers)} watching`} />
                  <div className="mt-3 flex gap-3">
                    <Avatar name={st.streamer} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium transition-colors group-hover:text-accent">{st.title}</p>
                      <p className="truncate text-[12px] text-fg-muted">
                        {st.streamer} · {st.game}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {clips.length > 0 && (
        <section aria-labelledby="clips-heading">
          <h2 id="clips-heading" className="text-[15px] font-medium">
            Clips
          </h2>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {clips.map((c) => {
              const author = getUser(c.authorId)?.displayName ?? "Unknown";
              return (
                <li key={c.id}>
                  <Link href={`/clip/${c.id}`} className="group block">
                    <ClipThumb
                      game={c.game}
                      duration={durationOf(c.mediaLabel)}
                      meta={c.views ? `${formatCount(c.views)} views` : undefined}
                    />
                    <div className="mt-3 flex gap-3">
                      <Avatar name={author} size={32} />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[14px] font-medium leading-5 transition-colors group-hover:text-accent">
                          {c.body}
                        </p>
                        <p className="truncate text-[12px] text-fg-muted">
                          {author} · {c.game}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {streams.length === 0 && clips.length === 0 && (
        <p className="py-12 text-center text-fg-muted">No videos for this game yet</p>
      )}
    </div>
  );
}
