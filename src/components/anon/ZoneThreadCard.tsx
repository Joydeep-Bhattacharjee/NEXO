import Link from "next/link";
import { BadgeCheck, ChartColumn, ChevronUp, Hourglass, MessageCircle } from "lucide-react";
import { realmLabel, zoneTimeAgo, type ZoneThread } from "@/lib/anon-threads";
import { formatCount } from "@/lib/mock-data";
import { IdentityAvatar } from "./IdentityAvatar";

type Props = {
  thread: ZoneThread;
  showRealm?: boolean;
};

export function ZoneThreadCard({ thread, showRealm }: Props) {
  return (
    <Link
      href={`/anon/${thread.realmSlug}/${thread.id}`}
      className="flex gap-4 rounded-card border border-line bg-raised p-4 transition-colors duration-150 hover:border-line-hover sm:p-5"
    >
      <IdentityAvatar hue={thread.authorHue} glyph={thread.authorGlyph} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-fg-muted">
          <span className="font-medium" style={{ color: thread.authorHue }}>
            {thread.authorName}
          </span>
          {thread.isYours && <span className="rounded-[4px] bg-overlay px-1.5 leading-5">You</span>}
          {thread.badge && (
            <span className="flex items-center gap-1">
              <BadgeCheck size={14} strokeWidth={1.5} aria-hidden />
              {thread.badge}
            </span>
          )}
          <span aria-hidden>·</span>
          {showRealm && (
            <>
              <span>{realmLabel(thread.realmSlug)}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <time className="font-mono">{zoneTimeAgo(thread.postedAt, thread.isYours)}</time>
          {thread.kind === "raid" && thread.expiresIn && (
            <span className="flex items-center gap-1 rounded-[4px] bg-warning/10 px-1.5 font-mono text-[11px] leading-5 text-warning">
              <Hourglass size={12} strokeWidth={1.5} aria-hidden />
              Raid · {thread.expiresIn} left
            </span>
          )}
          {thread.kind === "poll" && (
            <span className="flex items-center gap-1 rounded-[4px] bg-overlay px-1.5 text-[11px] leading-5">
              <ChartColumn size={12} strokeWidth={1.5} aria-hidden />
              Poll
            </span>
          )}
        </div>

        <h2 className="mt-1.5 text-[16px] font-medium leading-6">{thread.title}</h2>
        {thread.summary ? (
          <p className="mt-2 rounded-btn border border-line bg-base p-3 text-[13px] leading-5 text-fg-muted">
            <span className="font-medium text-fg">Summary</span> · {thread.summary}
          </p>
        ) : (
          thread.body && <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-fg-muted">{thread.body}</p>
        )}

        <div className="mt-3 flex gap-4 font-mono text-[12px] text-fg-muted">
          <span className="flex items-center gap-1 text-accent">
            <ChevronUp size={14} strokeWidth={1.5} aria-hidden />
            {formatCount(thread.respect)} respect
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} strokeWidth={1.5} aria-hidden />
            {formatCount(thread.comments)}
          </span>
        </div>
      </div>
    </Link>
  );
}
