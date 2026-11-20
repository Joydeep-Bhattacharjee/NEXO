"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EMPTY_LINES, TEXT_MAX, useAppHydration, useAppStore } from "@/lib/app-store";
import { DMS, USERS } from "@/lib/mock-data";

/** Thread ids are either a seeded DM (d1, d2…) or "u-<handle>" for a chat started from a profile. */
function partnerName(id: string): string | null {
  const dm = DMS.find((d) => d.id === id);
  if (dm) return dm.with;
  const handle = id.startsWith("u-") ? id.slice(2) : null;
  return USERS.find((u) => u.handle === handle)?.displayName ?? null;
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const isReady = useAppHydration();
  const lines = useAppStore((s) => s.dmThreads[id] ?? EMPTY_LINES);
  const sendDm = useAppStore((s) => s.sendDm);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLLIElement>(null);
  const name = partnerName(id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines.length]);

  if (!name) notFound();

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (sendDm(id, draft)) setDraft("");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-11.5rem)] max-w-2xl flex-col rounded-card border border-line bg-raised">
      <header className="flex h-14 items-center gap-3 border-b border-line px-3">
        <Link href="/inbox" aria-label="Back to messages" className="flex h-9 w-9 items-center justify-center rounded-btn text-fg-muted transition-colors hover:bg-overlay hover:text-fg">
          <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
        </Link>
        <Avatar name={name} size={32} />
        <h1 className="truncate text-[15px] font-medium">{name}</h1>
      </header>

      <ul className="rail-scroll flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {isReady && lines.length === 0 && <li className="m-auto text-[13px] text-fg-muted">Say hi to {name}</li>}
        {lines.map((l) => (
          <li key={l.id} className={`flex max-w-[80%] flex-col ${l.isMine ? "items-end self-end" : "items-start self-start"}`}>
            <p className={`rounded-[14px] px-3 py-2 text-[14px] leading-5 ${l.isMine ? "bg-accent text-accent-ink" : "bg-overlay"}`}>{l.body}</p>
            <time className="mt-0.5 px-1 font-mono text-[11px] text-fg-muted">{l.time}</time>
          </li>
        ))}
        <li ref={endRef} aria-hidden />
      </ul>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line p-3">
        <input
          autoFocus
          value={draft}
          maxLength={TEXT_MAX}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${name}`}
          aria-label="Message"
          className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none transition-colors focus:border-accent"
        />
        <Button type="submit" size="compact" disabled={!draft.trim()} aria-label="Send">
          <Send size={16} strokeWidth={1.5} aria-hidden />
        </Button>
      </form>
    </div>
  );
}
