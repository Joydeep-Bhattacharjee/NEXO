"use client";

import Link from "next/link";
import { Bookmark, Brain, Flame, Laugh, MessageCircle, Share2, Skull, type LucideIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";
import { useAppHydration, useAppStore, type ReactionKey } from "@/lib/app-store";
import { formatCount, type Post } from "@/lib/mock-data";

const REACTIONS: { key: ReactionKey; icon: LucideIcon; label: string }[] = [
  { key: "gg", icon: Flame, label: "GG" },
  { key: "skull", icon: Skull, label: "Skull" },
  { key: "lol", icon: Laugh, label: "LOL" },
  { key: "brain", icon: Brain, label: "Big brain" },
];

const ACTION =
  "flex h-8 items-center gap-1.5 rounded-btn px-2 text-[13px] transition-colors duration-150 hover:bg-overlay cursor-pointer";

async function copyLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/** Reactions, comments, share and save for one post. One reaction per viewer, tap again to undo. */
export function PostActions({ post }: { post: Post }) {
  const isReady = useAppHydration();
  const mine = useAppStore((s) => (isReady ? s.reactions[post.id] : undefined));
  const isSaved = useAppStore((s) => isReady && s.saved.includes(post.id));
  const extraComments = useAppStore((s) => (isReady ? (s.comments[post.id]?.length ?? 0) : 0));
  const react = useAppStore((s) => s.react);
  const toggleSave = useAppStore((s) => s.toggleSave);
  const toast = useToast((s) => s.show);

  async function handleShare() {
    const url = `${window.location.origin}/clip/${post.id}`;
    // The native share sheet suits phones; on desktop, copying the link is quicker.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && navigator.share) {
      try {
        await navigator.share({ url, text: post.body });
        return;
      } catch {
        /* fall through to copying when the share sheet is dismissed or unsupported */
      }
    }
    toast((await copyLink(url)) ? "Link copied" : `Copy this link: ${url}`);
  }

  return (
    <footer className="-mx-2 mt-3 flex items-center gap-0.5">
      {REACTIONS.map(({ key, icon: Icon, label }) => {
        const isMine = mine === key;
        return (
          <button
            key={key}
            onClick={() => react(post.id, key)}
            aria-pressed={isMine}
            aria-label={`React ${label}`}
            className={`${ACTION} ${isMine ? "text-accent" : "text-fg-muted hover:text-fg"}`}
          >
            <Icon size={16} strokeWidth={isMine ? 2 : 1.5} aria-hidden />
            <span className="font-mono text-[12px]">{formatCount(post.reactions[key] + (isMine ? 1 : 0))}</span>
          </button>
        );
      })}
      <span className="flex-1" />
      <Link href={`/clip/${post.id}`} aria-label="Comments" className={`${ACTION} text-fg-muted hover:text-fg`}>
        <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
        <span className="font-mono text-[12px]">{formatCount(post.comments + extraComments)}</span>
      </Link>
      <button onClick={handleShare} aria-label="Share" className={`${ACTION} text-fg-muted hover:text-fg`}>
        <Share2 size={16} strokeWidth={1.5} aria-hidden />
      </button>
      <button
        onClick={() => {
          toggleSave(post.id);
          toast(isSaved ? "Removed from saved" : "Saved");
        }}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Unsave" : "Save"}
        className={`${ACTION} ${isSaved ? "text-accent" : "text-fg-muted hover:text-fg"}`}
      >
        <Bookmark size={16} strokeWidth={1.5} fill={isSaved ? "currentColor" : "none"} aria-hidden />
      </button>
    </footer>
  );
}
