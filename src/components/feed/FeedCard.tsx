import Link from "next/link";
import { ClipThumb } from "@/components/media/ClipThumb";
import { Avatar } from "@/components/ui/Avatar";
import { PostActions } from "./PostActions";
import { formatCount, getMask, getUser, MOCK_NOW, type Post } from "@/lib/mock-data";

function timeAgo(iso: string): string {
  // Seeded posts are measured against the frozen mock clock; posts you make are measured against now.
  const posted = Date.parse(iso);
  const now = posted > Date.parse(MOCK_NOW) ? Date.now() : Date.parse(MOCK_NOW);
  const mins = Math.max(1, Math.floor((now - posted) / 60000));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function clipDuration(label?: string): string | undefined {
  return label?.split("·")[1]?.trim();
}

export function FeedCard({ post }: { post: Post }) {
  const isMask = post.authorType === "mask";
  const mask = isMask ? getMask(post.authorId) : undefined;
  const user = !isMask ? getUser(post.authorId) : undefined;
  const name = isMask ? (mask?.displayName ?? "Unknown Mask") : (user?.displayName ?? "Unknown");
  // Masks never link anywhere: an anonymous post must not lead back to a profile.
  const profileHref = user ? `/u/${user.handle}` : undefined;
  const isLive = post.kind === "live";
  const hasMedia = post.kind === "clip" || isLive;
  const views = post.views ? `${formatCount(post.views)} views` : undefined;

  return (
    <article className="border-b border-line px-1 py-5 sm:px-2">
      <header className="flex items-center gap-3">
        {profileHref ? (
          <Link href={profileHref} aria-label={`${name}'s profile`} className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <Avatar name={name} size={36} />
          </Link>
        ) : (
          <Avatar name={name} isMask={isMask} size={36} />
        )}
        <div className="min-w-0 flex-1">
          {profileHref ? (
            <Link href={profileHref} className="block truncate text-[14px] font-medium transition-colors hover:text-accent">
              {name}
            </Link>
          ) : (
            <p className={`truncate text-[14px] font-medium ${isMask ? "text-mask" : ""}`}>
              {name}
              {isMask && <span className="sr-only"> (anonymous Mask)</span>}
            </p>
          )}
          <p className="flex gap-3 truncate text-[13px] text-fg-muted">
            <span>{post.game}</span>
            <time>{timeAgo(post.postedAt)} ago</time>
          </p>
        </div>
      </header>

      <p className="mt-3 text-[15px] leading-[22px]">{post.body}</p>

      {hasMedia && (
        <Link
          href={post.kind === "clip" ? `/clip/${post.id}` : "/live"}
          aria-label={isLive ? `Watch ${name} live` : `Play clip from ${name}`}
          className="group mt-4 block"
        >
          <ClipThumb
            game={post.game}
            isLive={isLive}
            duration={clipDuration(post.mediaLabel)}
            meta={isLive ? "Watching now" : views}
          />
        </Link>
      )}

      <PostActions post={post} />
    </article>
  );
}
