"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BODY_MAX, TITLE_MAX, useActiveIdentity, useAnonStore } from "@/lib/anon-store";
import { realmLabel } from "@/lib/anon-threads";
import { REALMS } from "@/lib/mock-data";
import { IdentityAvatar } from "./IdentityAvatar";

/** Start a thread as the active identity. When no Realm is fixed, the poster picks one. */
export function ZoneComposer({ realmSlug }: { realmSlug?: string }) {
  const identity = useActiveIdentity();
  const addPost = useAnonStore((s) => s.addPost);
  const [isOpen, setIsOpen] = useState(false);
  const [realm, setRealm] = useState(realmSlug ?? REALMS[0].slug);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!identity) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give it a title");
      return;
    }
    const post = addPost({ realmSlug: realmSlug ?? realm, title, body });
    if (!post) {
      setError("Couldn't post that. Check the length and try again");
      return;
    }
    setTitle("");
    setBody("");
    setError(null);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-3 rounded-card border border-line bg-raised p-3 text-left text-[14px] text-fg-muted transition-colors hover:border-line-hover cursor-pointer"
      >
        <IdentityAvatar hue={identity.hue} glyph={identity.glyph} size={32} />
        Say something as {identity.name}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-card border border-line-hover bg-raised p-4">
      <div className="flex items-center gap-3 text-[13px]">
        <IdentityAvatar hue={identity.hue} glyph={identity.glyph} size={32} />
        <span className="font-medium" style={{ color: identity.hue }}>
          {identity.name}
        </span>
        {!realmSlug && (
          <>
            <span className="text-fg-muted">in</span>
            <select
              value={realm}
              onChange={(e) => setRealm(e.target.value)}
              aria-label="Realm"
              className="h-8 rounded-btn border border-line bg-overlay px-2 text-[13px] text-fg outline-none focus:border-accent"
            >
              {REALMS.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {realmLabel(r.slug)}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <input
        autoFocus
        value={title}
        maxLength={TITLE_MAX}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Title"
        className="h-11 rounded-btn border border-transparent bg-overlay px-3 text-[15px] font-medium outline-none transition-colors focus:border-accent"
      />
      <textarea
        value={body}
        maxLength={BODY_MAX}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What do you actually think"
        aria-label="Body"
        rows={4}
        className="resize-y rounded-btn border border-transparent bg-overlay px-3 py-2.5 text-[14px] leading-5 outline-none transition-colors focus:border-accent"
      />
      {error && <p className="text-[12px] text-danger">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="compact" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" size="compact">
          <Send size={16} strokeWidth={1.5} aria-hidden />
          Post
        </Button>
      </div>
    </form>
  );
}
