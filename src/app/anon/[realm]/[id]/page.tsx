"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, ChevronUp, Hourglass, MessageCircle } from "lucide-react";
import { IdentityAvatar } from "@/components/anon/IdentityAvatar";
import { Button } from "@/components/ui/Button";
import { BODY_MAX, useActiveIdentity, useAnonStore } from "@/lib/anon-store";
import { allThreads, commentsFor, realmLabel, zoneTimeAgo } from "@/lib/anon-threads";
import { formatCount } from "@/lib/mock-data";

const INDENT_PX = 20;

function RespectButton({ count, isOn, onToggle, label }: { count: number; isOn: boolean; onToggle: () => void; label?: string }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isOn}
      aria-label={isOn ? "Take back respect" : "Give respect"}
      className={`flex h-7 items-center gap-1 rounded-btn px-1.5 font-mono text-[12px] transition-colors cursor-pointer ${
        isOn ? "bg-accent/15 text-accent" : "text-fg-muted hover:bg-overlay hover:text-accent"
      }`}
    >
      <ChevronUp size={14} strokeWidth={isOn ? 2 : 1.5} aria-hidden />
      {formatCount(count + (isOn ? 1 : 0))}
      {label && ` ${label}`}
    </button>
  );
}

export default function ZoneThreadPage() {
  const { realm: slug, id } = useParams<{ realm: string; id: string }>();
  const posts = useAnonStore((s) => s.posts);
  const identities = useAnonStore((s) => s.identities);
  const replies = useAnonStore((s) => s.replies);
  const addReply = useAnonStore((s) => s.addReply);
  const respected = useAnonStore((s) => s.respected);
  const toggleRespect = useAnonStore((s) => s.toggleRespect);
  const identity = useActiveIdentity();
  const [draft, setDraft] = useState("");

  const thread = useMemo(
    () => allThreads(posts, identities).find((t) => t.id === id && t.realmSlug === slug),
    [posts, identities, id, slug],
  );
  const comments = useMemo(
    () => (thread ? commentsFor(thread, replies, identities) : []),
    [thread, replies, identities],
  );

  if (!thread) notFound();

  function handleReply(e: FormEvent) {
    e.preventDefault();
    if (addReply(id, draft)) setDraft("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/anon/${slug}`}
        className="flex w-fit items-center gap-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
        {realmLabel(slug)}
      </Link>

      <article className="rounded-card border border-line bg-raised p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <IdentityAvatar hue={thread.authorHue} glyph={thread.authorGlyph} size={40} />
          <div className="min-w-0 text-[13px]">
            <p className="flex items-center gap-2">
              <span className="font-medium" style={{ color: thread.authorHue }}>
                {thread.authorName}
              </span>
              {thread.badge && (
                <span className="flex items-center gap-1 text-fg-muted">
                  <BadgeCheck size={14} strokeWidth={1.5} aria-hidden />
                  {thread.badge}
                </span>
              )}
            </p>
            <time className="font-mono text-[12px] text-fg-muted">{zoneTimeAgo(thread.postedAt, thread.isYours)}</time>
          </div>
          {thread.kind === "raid" && thread.expiresIn && (
            <span className="ml-auto flex items-center gap-1 rounded-[4px] bg-warning/10 px-1.5 font-mono text-[11px] leading-5 text-warning">
              <Hourglass size={12} strokeWidth={1.5} aria-hidden />
              Archives in {thread.expiresIn}
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-[30px] font-bold leading-tight">{thread.title}</h1>
        {thread.body && <p className="mt-3 text-[15px] leading-6">{thread.body}</p>}
        {thread.summary && (
          <p className="mt-4 rounded-btn border border-line bg-base p-3 text-[13px] leading-5 text-fg-muted">
            <span className="font-medium text-fg">Pinned summary</span> · {thread.summary}
          </p>
        )}
        <div className="mt-4 flex gap-4 font-mono text-[13px] text-fg-muted">
          <RespectButton
            count={thread.respect}
            isOn={respected.includes(thread.id)}
            onToggle={() => toggleRespect(thread.id)}
            label="respect"
          />
          <span className="flex items-center gap-1">
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
            {formatCount(thread.comments + comments.filter((c) => c.isYours).length)}
          </span>
        </div>
      </article>

      {identity && (
        <form onSubmit={handleReply} className="flex items-center gap-3 rounded-card border border-line bg-raised p-3">
          <IdentityAvatar hue={identity.hue} glyph={identity.glyph} size={32} />
          <input
            value={draft}
            maxLength={BODY_MAX}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Reply as ${identity.name}`}
            aria-label="Reply"
            className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none transition-colors focus:border-accent"
          />
          <Button type="submit" size="compact" disabled={!draft.trim()}>
            Reply
          </Button>
        </form>
      )}

      <ul className="flex flex-col gap-3">
        {comments.map((c) => (
          <li key={c.id} style={{ marginLeft: c.depth * INDENT_PX }}>
            <div className={`rounded-card border bg-raised p-4 ${c.depth > 0 ? "border-line border-l-accent/40" : "border-line"}`}>
              <div className="flex items-center gap-2 text-[13px]">
                <IdentityAvatar hue={c.authorHue} glyph={c.authorGlyph} size={24} />
                <span className="font-medium" style={{ color: c.authorHue }}>
                  {c.authorName}
                </span>
                {c.isYours && <span className="rounded-[4px] bg-overlay px-1.5 text-[11px] leading-5 text-fg-muted">You</span>}
                {c.badge && (
                  <span className="flex items-center gap-1 text-[12px] text-fg-muted">
                    <BadgeCheck size={14} strokeWidth={1.5} aria-hidden />
                    {c.badge}
                  </span>
                )}
                <time className="ml-auto font-mono text-[12px] text-fg-muted">{zoneTimeAgo(c.postedAt, c.isYours)}</time>
              </div>
              <p className="mt-2 text-[14px] leading-[21px]">{c.body}</p>
              <div className="mt-2">
                <RespectButton count={c.respect} isOn={respected.includes(c.id)} onToggle={() => toggleRespect(c.id)} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
