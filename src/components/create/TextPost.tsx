"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { TEXT_MAX, useAppStore } from "@/lib/app-store";
import { CURRENT_USER, GAMES } from "@/lib/mock-data";
import { FIELD, FlowShell, GameSelect } from "./shared";

/** A plain text post to your public feed. */
export function TextPost({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const addPost = useAppStore((s) => s.addPost);
  const toast = useToast((s) => s.show);
  const [body, setBody] = useState("");
  const [game, setGame] = useState(GAMES[0].name);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addPost({ authorId: CURRENT_USER.id, kind: "text", game, body })) return;
    toast("Posted");
    router.push("/home");
  }

  return (
    <FlowShell title="Post" onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          autoFocus
          value={body}
          maxLength={TEXT_MAX}
          rows={5}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What happened in your last match"
          aria-label="Post"
          className={`py-2.5 ${FIELD}`}
        />
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <GameSelect value={game} onChange={setGame} />
          </div>
          <span className="pb-3 font-mono text-[12px] text-fg-muted">
            {body.length}/{TEXT_MAX}
          </span>
        </div>
        <Button type="submit" disabled={!body.trim()}>
          Post
        </Button>
      </form>
    </FlowShell>
  );
}
