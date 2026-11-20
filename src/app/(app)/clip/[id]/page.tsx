"use client";

import { useState, type FormEvent } from "react";
import { notFound, useParams } from "next/navigation";
import { Send } from "lucide-react";
import { FeedCard } from "@/components/feed/FeedCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EMPTY_COMMENTS, TEXT_MAX, useAppHydration, useAppStore } from "@/lib/app-store";
import { CURRENT_USER, PUBLIC_POSTS } from "@/lib/mock-data";

/** A single public post with its comments. */
export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const isReady = useAppHydration();
  const myPosts = useAppStore((s) => s.myPosts);
  const comments = useAppStore((s) => s.comments[id] ?? EMPTY_COMMENTS);
  const addComment = useAppStore((s) => s.addComment);
  const [draft, setDraft] = useState("");

  const post = PUBLIC_POSTS.find((p) => p.id === id) ?? myPosts.find((p) => p.id === id);
  if (!post) {
    if (!isReady) return <div className="mx-auto h-64 max-w-[680px] rounded-card border border-line bg-raised" aria-busy="true" />;
    notFound();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (addComment(id, draft)) setDraft("");
  }

  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-4">
      <FeedCard post={post} />

      <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-card border border-line bg-raised p-3">
        <Avatar name={CURRENT_USER.displayName} size={32} />
        <input
          value={draft}
          maxLength={TEXT_MAX}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a comment"
          aria-label="Add a comment"
          className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none transition-colors focus:border-accent"
        />
        <Button type="submit" size="compact" disabled={!draft.trim()} aria-label="Post comment">
          <Send size={16} strokeWidth={1.5} aria-hidden />
        </Button>
      </form>

      {comments.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-card border border-line bg-raised p-4">
              <Avatar name={CURRENT_USER.displayName} size={32} />
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{CURRENT_USER.displayName}</p>
                <p className="mt-0.5 text-[14px] leading-5">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-[13px] text-fg-muted">Be the first to comment</p>
      )}
    </div>
  );
}
