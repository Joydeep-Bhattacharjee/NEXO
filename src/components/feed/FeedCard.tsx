import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import {
  formatCount,
  getMask,
  getUser,
  type Post,
} from "@/lib/mock-data";

const REACTIONS: { key: keyof Post["reactions"]; emoji: string; label: string }[] = [
  { key: "gg", emoji: "🔥", label: "GG" },
  { key: "skull", emoji: "💀", label: "Skull" },
  { key: "lol", emoji: "😂", label: "LOL" },
  { key: "brain", emoji: "🧠", label: "Big brain" },
];

function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.floor((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function FeedCard({ post }: { post: Post }) {
  const isMask = post.authorType === "mask";
  const mask = isMask ? getMask(post.authorId) : undefined;
  const user = !isMask ? getUser(post.authorId) : undefined;
  const name = isMask ? (mask?.displayName ?? "Unknown Mask") : (user?.displayName ?? "Unknown");
  const avatar = isMask ? (mask?.avatar ?? "🎭") : (user?.avatar ?? "👤");

  return (
    <article className="card-rise rounded-card border border-line bg-raised p-4 transition-colors duration-150 hover:border-line-hover">
      {/* header */}
      <div className="flex items-center gap-3">
        <Avatar
          emoji={avatar}
          isMask={isMask}
          isLive={post.kind === "live"}
          label={name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`truncate text-[15px] font-semibold ${isMask ? "text-mask" : ""}`}>
              {name}
            </span>
            {isMask && <span aria-label="anonymous mask" className="text-[11px]">🎭</span>}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-fg-muted">
            <span className="rounded bg-overlay px-1.5 py-0.5">{post.game}</span>
            <time className="font-mono">{timeAgo(post.postedAt)}</time>
          </div>
        </div>
        {post.kind === "live" && (
          <span className="rounded-full bg-live px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
            ● Live
          </span>
        )}
      </div>

      {/* body */}
      <p className="mt-3 text-[15px] leading-[22px]">{post.body}</p>

      {/* media placeholder */}
      {(post.kind === "clip" || post.kind === "live") && (
        <Link
          href={post.kind === "clip" ? `/clip/${post.id}` : "/live"}
          className="mt-3 flex aspect-video items-center justify-center rounded-[10px] border border-line bg-base transition-colors hover:border-line-hover"
        >
          <span className="flex flex-col items-center gap-2 text-fg-muted">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-overlay text-xl">
              ▶
            </span>
            <span className="font-mono text-[12px]">
              {post.mediaLabel ?? "live stream"}
              {post.views ? ` · ${formatCount(post.views)} views` : ""}
            </span>
          </span>
        </Link>
      )}

      {/* reaction bar */}
      <div className="mt-3 flex items-center gap-1 border-t border-line pt-3">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            aria-label={`React ${r.label}`}
            className="flex h-8 items-center gap-1 rounded-full px-2.5 text-[13px] text-fg-muted transition-colors duration-150 hover:bg-overlay hover:text-fg cursor-pointer"
          >
            <span aria-hidden>{r.emoji}</span>
            <span className="font-mono">{formatCount(post.reactions[r.key])}</span>
          </button>
        ))}
        <span className="flex-1" />
        <button className="flex h-8 items-center gap-1 rounded-full px-2.5 text-[13px] text-fg-muted transition-colors hover:bg-overlay hover:text-fg cursor-pointer">
          💬 <span className="font-mono">{formatCount(post.comments)}</span>
        </button>
        <button aria-label="Share" className="flex h-8 items-center rounded-full px-2.5 text-[13px] text-fg-muted transition-colors hover:bg-overlay hover:text-fg cursor-pointer">
          ↗
        </button>
        <button aria-label="Save" className="flex h-8 items-center rounded-full px-2.5 text-[13px] text-fg-muted transition-colors hover:bg-overlay hover:text-fg cursor-pointer">
          🔖
        </button>
      </div>
    </article>
  );
}
