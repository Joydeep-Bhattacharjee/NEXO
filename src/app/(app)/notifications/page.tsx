"use client";

import Link from "next/link";
import { Bell, Flame, Radio, Reply, ShieldCheck, UserPlus, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useFriendsHydration, useFriendsStore } from "@/lib/friends-store";
import { NOTIFICATIONS, USERS } from "@/lib/mock-data";

const KIND_ICONS: Record<string, LucideIcon> = {
  reaction: Flame,
  reply: Reply,
  follow: UserPlus,
  live: Radio,
  mod: ShieldCheck,
};

function KindIcon({ kind, isUnread }: { kind: string; isUnread: boolean }) {
  const Icon = KIND_ICONS[kind] ?? Bell;
  return <Icon size={18} strokeWidth={1.5} aria-hidden className={`shrink-0 ${isUnread ? "text-fg" : "text-fg-muted"}`} />;
}

function FriendRequests() {
  const isReady = useFriendsHydration();
  const { received, accept, decline } = useFriendsStore();
  const people = received.map((id) => USERS.find((u) => u.id === id)).filter((u) => u !== undefined);
  if (!isReady || people.length === 0) return null;

  return (
    <section aria-labelledby="requests-heading" className="flex flex-col gap-2">
      <h2 id="requests-heading" className="text-[14px] font-medium">
        Friend requests
      </h2>
      <ul className="flex flex-col gap-2">
        {people.map((u) => (
          <li key={u.id} className="flex items-center gap-3 rounded-card border border-line-hover bg-raised p-4">
            <Link href={`/u/${u.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar name={u.displayName} size={40} />
              <span className="min-w-0 text-[14px]">
                <span className="font-medium">{u.displayName}</span>
                <span className="text-fg-muted"> wants to be friends</span>
              </span>
            </Link>
            <Button size="compact" onClick={() => accept(u.id)}>Accept</Button>
            <Button variant="ghost" size="compact" onClick={() => decline(u.id)}>Decline</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** §3.11 — Notifications, with friend requests on top. */
export default function NotificationsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-[36px] font-bold leading-tight">Notifications</h1>
      <FriendRequests />
      <section aria-label="Activity">
        <ul className="flex flex-col gap-2">
          {NOTIFICATIONS.map((n) => (
            <li
              key={n.id}
              className={`flex items-center gap-3 rounded-card border p-4 ${
                n.unread ? "border-line-hover bg-raised" : "border-line bg-base text-fg-muted"
              }`}
            >
              <KindIcon kind={n.kind} isUnread={n.unread} />
              <p className="min-w-0 flex-1 text-[14px]">{n.text}</p>
              <time className="font-mono text-[11px] text-fg-muted">{n.time}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
