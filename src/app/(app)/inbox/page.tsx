"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { DMS, NOTIFICATIONS } from "@/lib/mock-data";

const KIND_ICONS: Record<string, string> = {
  reaction: "🔥",
  reply: "💬",
  follow: "➕",
  live: "🔴",
  mod: "🛡️",
};

/** §3.11 — DMs + Notifications tabs. */
export default function InboxPage() {
  const [tab, setTab] = useState<"dms" | "notifs">("dms");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">Inbox</h1>
      <div role="tablist" aria-label="Inbox" className="flex rounded-btn bg-overlay p-1">
        {(
          [
            ["dms", "Messages"],
            ["notifs", "Notifications"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`h-9 flex-1 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer ${
              tab === key ? "bg-raised text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "dms" ? (
        <ul className="flex flex-col gap-2">
          {DMS.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-card border border-line bg-raised p-4 transition-colors hover:border-line-hover"
            >
              <Avatar emoji={d.avatar} size={44} label={d.with} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{d.with}</p>
                <p className="truncate text-[13px] text-fg-muted">{d.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <time className="font-mono text-[11px] text-fg-muted">{d.time}</time>
                {d.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[11px] font-bold text-accent-ink">
                    {d.unread}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-2">
          {NOTIFICATIONS.map((n) => (
            <li
              key={n.id}
              className={`flex items-center gap-3 rounded-card border p-4 ${
                n.unread ? "border-accent/30 bg-accent/5" : "border-line bg-raised"
              }`}
            >
              <span className="text-lg" aria-hidden>{KIND_ICONS[n.kind]}</span>
              <p className="min-w-0 flex-1 text-[14px]">{n.text}</p>
              <time className="font-mono text-[11px] text-fg-muted">{n.time}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
