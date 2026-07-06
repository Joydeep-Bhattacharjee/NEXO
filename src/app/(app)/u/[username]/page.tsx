import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  CURRENT_USER,
  FEED_POSTS,
  formatCount,
  GAME_OF_LIFE_PROMPTS,
  USERS,
} from "@/lib/mock-data";

/** §3.10 — Profile. Never shows Realm/Mask activity — hard wall. */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = USERS.find((u) => u.handle === username);
  if (!user) notFound();
  const isOwn = user.id === CURRENT_USER.id;
  const clips = FEED_POSTS.filter(
    (p) => p.authorType === "user" && p.authorId === user.id && p.kind === "clip",
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      {/* header */}
      <header className="flex flex-col items-start gap-4 rounded-card border border-line bg-raised p-6 sm:flex-row sm:items-center">
        <Avatar emoji={user.avatar} size={80} isLive={user.isLive} label={user.displayName} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold">{user.displayName}</h1>
          <p className="font-mono text-[13px] text-fg-muted">@{user.handle}</p>
          <p className="mt-1 text-[14px]">{user.bio}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.gameTags.map((g) => (
              <span key={g} className="rounded bg-overlay px-2 py-0.5 text-[12px] text-fg-muted">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-2 font-mono text-[13px] text-fg-muted">
            <span className="text-fg">{formatCount(user.followers)}</span> followers ·{" "}
            <span className="text-fg">{user.following}</span> following
          </p>
        </div>
        <div className="flex gap-2">
          {isOwn ? (
            <>
              <Button size="compact">Add new post</Button>
              <Button variant="secondary" size="compact">✨ AI edit</Button>
            </>
          ) : (
            <>
              <Button size="compact">Follow</Button>
              <Button variant="secondary" size="compact">Message</Button>
            </>
          )}
        </div>
      </header>

      {/* game of life */}
      <section className="rounded-card border border-line bg-raised p-5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-fg-muted">
          Game of Life
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {GAME_OF_LIFE_PROMPTS.map((p) => (
            <li key={p.q} className="rounded-[10px] border border-line bg-base p-3">
              <p className="text-[12px] text-fg-muted">{p.q}</p>
              <p className="mt-1 text-[13px] font-medium">{p.a}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* tabs */}
      <div className="flex gap-2" role="tablist" aria-label="Profile sections">
        {["Posts", "Clips", "Servers", "About"].map((t, i) => (
          <Chip key={t} isActive={i === 1}>{t}</Chip>
        ))}
      </div>

      {/* clips grid */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {clips.length > 0 ? (
          clips.map((c) => (
            <li key={c.id} className="flex aspect-[9/12] flex-col items-center justify-center gap-2 rounded-card border border-line bg-raised text-fg-muted">
              ▶
              <span className="font-mono text-[11px]">{formatCount(c.views ?? 0)} views</span>
            </li>
          ))
        ) : (
          <li className="col-span-full py-8 text-center text-fg-muted">No clips yet.</li>
        )}
      </ul>
    </div>
  );
}
