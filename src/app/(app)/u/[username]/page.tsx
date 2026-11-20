import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FriendButton } from "@/components/friends/FriendButton";
import { PhotoPicker } from "@/components/profile/PhotoPicker";
import { ProfileSections } from "@/components/profile/ProfileSections";
import {
  CURRENT_USER,
  formatCount,
  PUBLIC_POSTS,
  SERVERS,
  GAME_OF_LIFE_PROMPTS,
  USERS,
} from "@/lib/mock-data";
import { Scissors } from "lucide-react";

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
  const clips = PUBLIC_POSTS.filter((p) => p.authorId === user.id && p.kind === "clip");
  const posts = PUBLIC_POSTS.filter((p) => p.authorId === user.id && p.kind !== "clip");
  // Mock data only records membership for you; for others, show top-level servers for the games they play.
  const games = user.gameTags.map((g) => g.toLowerCase().split(" ")[0]);
  const servers = SERVERS.filter((s) =>
    isOwn ? s.joined : !s.parentSlug && games.some((g) => s.name.toLowerCase().includes(g)),
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      {/* header */}
      <header className="flex flex-col items-start gap-4 rounded-card border border-line bg-raised p-6 sm:flex-row sm:items-center">
        {isOwn ? <PhotoPicker /> : <Avatar size={80} isLive={user.isLive} name={user.displayName} />}
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[28px] font-bold leading-tight">{user.displayName}</h1>
          <p className="font-mono text-[13px] text-fg-muted">@{user.handle}</p>
          <p className="mt-1 text-[14px]">{user.bio}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.gameTags.map((g) => (
              <span key={g} className="rounded-[6px] border border-line px-2 text-[12px] leading-6 text-fg-muted">
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
              <Link href="/create">
                <Button size="compact">New post</Button>
              </Link>
              <Link href="/create">
              <Button variant="secondary" size="compact"><Scissors size={16} strokeWidth={1.5} aria-hidden />
                Auto-cut</Button>
              </Link>
            </>
          ) : (
            <>
              <FriendButton userId={user.id} name={user.displayName} />
              <Link href={`/inbox/u-${user.handle}`}>
                <Button variant="secondary" size="compact">Message</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* game of life */}
      <section className="rounded-card border border-line bg-raised p-5">
        <h2 className="text-[13px] font-medium text-fg-muted">
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

      <ProfileSections clips={clips} posts={posts} servers={servers} isOwn={isOwn} />
    </div>
  );
}
