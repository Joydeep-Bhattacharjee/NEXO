"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Scissors, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { EMPTY_LINES, TEXT_MAX, useAppHydration, useAppStore } from "@/lib/app-store";
import { CURRENT_USER, type Stream } from "@/lib/mock-data";

const CLIP_COOLDOWN_MS = 30_000;

/** Follow the streamer, or save the last 30 seconds as a clip on your feed. */
export function StreamActions({ stream }: { stream: Stream }) {
  const isReady = useAppHydration();
  const isFollowing = useAppStore((s) => isReady && s.follows.includes(stream.streamerHandle));
  const toggleFollow = useAppStore((s) => s.toggleFollow);
  const addPost = useAppStore((s) => s.addPost);
  const toast = useToast((s) => s.show);
  const [lastClipAt, setLastClipAt] = useState(0);

  function clip() {
    const now = Date.now();
    if (now - lastClipAt < CLIP_COOLDOWN_MS) {
      toast("You just clipped this. Give it a few seconds");
      return;
    }
    addPost({
      authorId: CURRENT_USER.id,
      kind: "clip",
      game: stream.game,
      body: `Clipped from ${stream.streamer}: ${stream.title}`,
      mediaLabel: "clip · 0:30",
      views: 0,
    });
    setLastClipAt(now);
    toast("Last 30 seconds clipped to your feed");
  }

  return (
    <>
      <Button
        size="compact"
        variant={isFollowing ? "secondary" : "primary"}
        onClick={() => {
          toggleFollow(stream.streamerHandle);
          toast(isFollowing ? `Unfollowed ${stream.streamer}` : `Following ${stream.streamer}`);
        }}
      >
        {isFollowing && <Check size={16} strokeWidth={1.5} aria-hidden />}
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <Button variant="secondary" size="compact" onClick={clip}>
        <Scissors size={16} strokeWidth={1.5} aria-hidden />
        Clip last 30s
      </Button>
    </>
  );
}

type SeedLine = { name: string; body: string };

/** Stream chat: seeded lines plus whatever you send. */
export function StreamChat({ handle, seed }: { handle: string; seed: SeedLine[] }) {
  const key = `live-${handle}`;
  const isReady = useAppHydration();
  const mine = useAppStore((s) => (isReady ? (s.channelMessages[key] ?? EMPTY_LINES) : EMPTY_LINES));
  const send = useAppStore((s) => s.sendChannel);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [mine.length]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (send(key, draft)) setDraft("");
  }

  return (
    <aside className="flex h-80 flex-[3] flex-col rounded-card border border-line bg-raised lg:h-auto">
      <header className="flex h-11 items-center justify-between border-b border-line px-3 text-[13px] font-medium">
        Stream chat
        <span className="font-mono text-[11px] font-normal text-fg-muted">slow mode</span>
      </header>
      <ul className="rail-scroll flex-1 space-y-2 overflow-y-auto p-3 text-[13px]">
        {seed.map((c) => (
          <li key={`${c.name}-${c.body}`}>
            <span className="font-medium text-fg-muted">{c.name}</span> <span>{c.body}</span>
          </li>
        ))}
        {mine.map((m) => (
          <li key={m.id}>
            <span className="font-medium text-accent">{CURRENT_USER.handle}</span> <span>{m.body}</span>
          </li>
        ))}
        <li ref={endRef} aria-hidden />
      </ul>
      <form onSubmit={handleSend} className="flex gap-2 border-t border-line p-2">
        <input
          value={draft}
          maxLength={TEXT_MAX}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Send a message"
          aria-label="Chat message"
          className="h-9 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[13px] outline-none focus:border-accent"
        />
        <Button type="submit" size="compact" disabled={!draft.trim()} aria-label="Send" className="px-3">
          <Send size={14} strokeWidth={1.5} aria-hidden />
        </Button>
      </form>
    </aside>
  );
}
