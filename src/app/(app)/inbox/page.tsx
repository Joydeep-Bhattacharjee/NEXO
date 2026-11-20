"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { useAppHydration, useAppStore } from "@/lib/app-store";
import { DMS, USERS } from "@/lib/mock-data";

/** §3.11 — Messages only. Notifications have their own tab. */
export default function InboxPage() {
  const isReady = useAppHydration();
  const threads = useAppStore((s) => s.dmThreads);

  const started = isReady
    ? Object.keys(threads)
        .filter((id) => id.startsWith("u-") && threads[id].length > 0)
        .map((id) => {
          const user = USERS.find((u) => `u-${u.handle}` === id);
          return user ? { id, with: user.displayName, unread: 0, time: "" } : null;
        })
        .filter((t) => t !== null)
    : [];
  const rows = [...started, ...DMS];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="font-display text-[36px] font-bold leading-tight">Messages</h1>
      <ul className="flex flex-col gap-2">
        {rows.map((d) => {
          const last = threads[d.id]?.at(-1);
          const unread = last && !last.isMine ? d.unread : 0;
          return (
            <li key={d.id}>
              <Link
                href={`/inbox/${d.id}`}
                className="flex items-center gap-3 rounded-card border border-line bg-raised p-4 transition-colors hover:border-line-hover"
              >
                <Avatar size={44} name={d.with} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{d.with}</p>
                  <p className={`truncate text-[13px] ${unread > 0 ? "text-fg" : "text-fg-muted"}`}>
                    {last ? `${last.isMine ? "You: " : ""}${last.body}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <time className="font-mono text-[11px] text-fg-muted">{last?.time ?? d.time}</time>
                  {unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[11px] font-medium text-accent-ink">
                      {unread}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
