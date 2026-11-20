"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { CreateIdentity } from "@/components/anon/CreateIdentity";
import { IdentityAvatar } from "@/components/anon/IdentityAvatar";
import { Button } from "@/components/ui/Button";
import { MAX_IDENTITIES, useAnonStore } from "@/lib/anon-store";

/** Your identities in the zone. Switch who you are, make a new one, or retire one. */
export default function ZoneIdentitiesPage() {
  const identities = useAnonStore((s) => s.identities);
  const activeId = useAnonStore((s) => s.activeId);
  const posts = useAnonStore((s) => s.posts);
  const switchIdentity = useAnonStore((s) => s.switchIdentity);
  const removeIdentity = useAnonStore((s) => s.removeIdentity);
  const [isCreating, setIsCreating] = useState(identities.length === 0);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isCreating) {
    return (
      <div className="mx-auto max-w-md">
        <CreateIdentity isFirst={identities.length === 0} onDone={() => setIsCreating(false)} />
        {identities.length > 0 && (
          <Button variant="ghost" className="mt-3 w-full" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display text-[36px] font-bold leading-tight">Your identities</h1>
          <p className="mt-1 max-w-md text-[14px] text-fg-muted">
            Each one is separate. They can&apos;t see each other and none of them link to your main profile
          </p>
        </div>
        <Button size="compact" onClick={() => setIsCreating(true)} disabled={identities.length >= MAX_IDENTITIES}>
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          New identity
        </Button>
      </header>

      <ul className="flex flex-col gap-2">
        {identities.map((i) => {
          const isActive = i.id === activeId;
          const postCount = posts.filter((p) => p.identityId === i.id).length;
          return (
            <li
              key={i.id}
              className={`flex items-center gap-4 rounded-card border bg-raised p-4 ${isActive ? "border-line-hover" : "border-line"}`}
            >
              <IdentityAvatar hue={i.hue} glyph={i.glyph} size={44} isActive={isActive} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium" style={{ color: i.hue }}>
                  {i.name}
                </p>
                <p className="font-mono text-[12px] text-fg-muted">
                  {postCount} {postCount === 1 ? "thread" : "threads"} · since{" "}
                  {new Date(i.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>
              {isActive ? (
                <span className="flex items-center gap-1 text-[13px] text-fg-muted">
                  <Check size={16} strokeWidth={1.5} aria-hidden />
                  In use
                </span>
              ) : (
                <Button variant="secondary" size="compact" onClick={() => switchIdentity(i.id)}>
                  Use
                </Button>
              )}
              {confirmId === i.id ? (
                <Button
                  variant="danger"
                  size="compact"
                  onClick={() => {
                    removeIdentity(i.id);
                    setConfirmId(null);
                  }}
                >
                  Retire for good
                </Button>
              ) : (
                <button
                  onClick={() => setConfirmId(i.id)}
                  aria-label={`Retire ${i.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-btn text-fg-muted transition-colors hover:bg-overlay hover:text-danger cursor-pointer"
                >
                  <Trash2 size={16} strokeWidth={1.5} aria-hidden />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-[12px] text-fg-muted">
        Up to {MAX_IDENTITIES}{" "}identities. For now they&apos;re saved on this device only
      </p>
    </div>
  );
}
