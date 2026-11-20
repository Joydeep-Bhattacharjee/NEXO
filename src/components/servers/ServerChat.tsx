"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Hash, Mic, Paperclip, PhoneOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ServerMark } from "@/components/ui/ServerMark";
import { useToast } from "@/components/ui/Toaster";
import { EMPTY_LINES, TEXT_MAX, useAppHydration, useAppStore } from "@/lib/app-store";
import { CURRENT_USER, formatCount, MESSAGES, USERS, type Server } from "@/lib/mock-data";
import { CHANNEL_ICONS } from "./channelIcons";
import { VoiceNotePlayer } from "./VoiceNotePlayer";
import { VoiceRecorder, type VoiceNote } from "./VoiceRecorder";

const SEEDED_CHANNEL = "general";
const MAX_FILE_BYTES = 50 * 1024 * 1024;

type SessionNote = VoiceNote & { id: string; time: string };

/** §3.6 — channel list, message stream with composer, member list. */
export function ServerChat({ server }: { server: Server }) {
  const firstText = server.channels.find((c) => c.name === SEEDED_CHANNEL) ?? server.channels[0];
  const [channelId, setChannelId] = useState(firstText.id);
  const [inVoice, setInVoice] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, SessionNote[]>>({});
  const [draft, setDraft] = useState("");
  const isReady = useAppHydration();
  const send = useAppStore((s) => s.sendChannel);
  const toast = useToast((s) => s.show);
  const endRef = useRef<HTMLLIElement>(null);

  const channel = server.channels.find((c) => c.id === channelId) ?? firstText;
  const key = `${server.slug}/${channel.id}`;
  const mine = useAppStore((s) => (isReady ? (s.channelMessages[key] ?? EMPTY_LINES) : EMPTY_LINES));
  const seeded = channel.name === SEEDED_CHANNEL ? MESSAGES : [];
  const myNotes = notes[key] ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [mine.length, myNotes.length, channelId]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (send(key, draft)) setDraft("");
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      toast("Files must be under 50 MB");
      return;
    }
    send(key, `Shared a file: ${file.name}`);
  }

  function addNote(note: VoiceNote) {
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setNotes((n) => ({ ...n, [key]: [...(n[key] ?? []), { ...note, id: `${Date.now()}`, time }] }));
  }

  function openChannel(id: string, type: string) {
    if (type === "voice") {
      setInVoice(id);
      toast("Joined voice");
      return;
    }
    setChannelId(id);
  }

  return (
    <div className="flex h-[calc(100vh-11.5rem)] gap-4">
      <aside className="hidden w-52 shrink-0 flex-col rounded-card border border-line bg-raised p-3 md:flex">
        <h1 className="flex items-center gap-2 px-1 pb-3 font-display text-[18px] font-bold">
          <ServerMark name={server.name} size={24} />
          <span className="truncate">{server.name}</span>
        </h1>
        <ul className="flex flex-col gap-0.5">
          {server.channels.map((c) => {
            const Icon = CHANNEL_ICONS[c.type];
            const isActive = c.id === channelId || c.id === inVoice;
            return (
              <li key={c.id}>
                <button
                  onClick={() => openChannel(c.id, c.type)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] transition-colors cursor-pointer ${
                    isActive ? "bg-overlay text-fg" : "text-fg-muted hover:bg-overlay hover:text-fg"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
                  <span className="truncate">{c.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {inVoice && (
          <div className="mt-auto flex items-center gap-2 rounded-btn border border-line bg-base p-2 text-[12px]">
            <Mic size={14} strokeWidth={1.5} aria-hidden className="text-accent" />
            <span className="flex-1 truncate">In {server.channels.find((c) => c.id === inVoice)?.name}</span>
            <button
              onClick={() => setInVoice(null)}
              aria-label="Leave voice"
              className="rounded-[6px] p-1 text-danger hover:bg-danger/10 cursor-pointer"
            >
              <PhoneOff size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        )}
      </aside>

      <section className="flex min-w-0 flex-1 flex-col rounded-card border border-line bg-raised">
        <header className="flex h-12 items-center gap-2 border-b border-line px-4 text-[14px] font-medium">
          <Hash size={16} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
          {channel.name}
          <span className="font-mono text-[11px] font-normal text-fg-muted">{formatCount(server.online)} online</span>
        </header>
        <ul className="rail-scroll flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {seeded.length === 0 && mine.length === 0 && myNotes.length === 0 && (
            <li className="m-auto text-[13px] text-fg-muted">Nothing in #{channel.name} yet. Start it off</li>
          )}
          {seeded.map((m) => (
            <li key={m.id} className={`flex gap-3 ${m.isAI ? "-mx-3 rounded-card border border-line bg-base p-3" : ""}`}>
              <Avatar size={36} name={m.author} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-[14px] font-medium ${m.isAI ? "text-accent" : ""}`}>
                    {m.author}
                    {m.isAI && <span className="ml-1.5 rounded bg-accent/15 px-1 text-[10px] font-medium">Bot</span>}
                  </span>
                  <time className="font-mono text-[11px] text-fg-muted">{m.time}</time>
                </div>
                {m.isVoiceNote ? <VoiceNotePlayer seconds={23} /> : <p className="text-[14px] leading-[21px]">{m.body}</p>}
                {m.reactions && (
                  <div className="mt-1.5 flex gap-1.5">
                    {m.reactions.map((r) => (
                      <span key={r} className="rounded-full border border-line bg-overlay px-2 py-0.5 text-[12px]">
                        {r} 1
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
          {mine.map((m) => (
            <li key={m.id} className="flex gap-3">
              <Avatar size={36} name={CURRENT_USER.displayName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-medium">{CURRENT_USER.displayName}</span>
                  <time className="font-mono text-[11px] text-fg-muted">{m.time}</time>
                </div>
                <p className="text-[14px] leading-[21px]">{m.body}</p>
              </div>
            </li>
          ))}
          {myNotes.map((n) => (
            <li key={n.id} className="flex gap-3">
              <Avatar size={36} name={CURRENT_USER.displayName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-medium">{CURRENT_USER.displayName}</span>
                  <time className="font-mono text-[11px] text-fg-muted">{n.time}</time>
                </div>
                <VoiceNotePlayer seconds={n.seconds} url={n.url} />
              </div>
            </li>
          ))}
          <li ref={endRef} aria-hidden />
        </ul>
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line p-3">
          <label
            aria-label="Attach a file"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn text-fg-muted transition-colors hover:bg-overlay hover:text-fg cursor-pointer"
          >
            <Paperclip size={18} strokeWidth={1.5} aria-hidden />
            <input type="file" onChange={handleFile} className="sr-only" />
          </label>
          <input
            value={draft}
            maxLength={TEXT_MAX}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message #${channel.name}`}
            aria-label="Message"
            className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none transition-colors focus:border-accent"
          />
          <VoiceRecorder onDone={addNote} />
          <Button type="submit" size="compact" disabled={!draft.trim()}>
            Send
          </Button>
        </form>
      </section>

      <aside className="hidden w-48 shrink-0 rounded-card border border-line bg-raised p-3 2xl:block">
        <h2 className="px-1 pb-2 text-[12px] font-medium text-fg-muted">Members</h2>
        <ul className="flex flex-col gap-1">
          {USERS.map((u) => (
            <li key={u.id} className="flex items-center gap-2 rounded-[8px] px-1.5 py-1">
              <Avatar size={28} isLive={u.isLive} name={u.displayName} />
              <span className="truncate text-[13px]">{u.displayName}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
