"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useFriendsHydration, useFriendsStore } from "@/lib/friends-store";
import { USERS, type User } from "@/lib/mock-data";

function byIds(ids: string[]): User[] {
  return ids.map((id) => USERS.find((u) => u.id === id)).filter((u): u is User => Boolean(u));
}

function PersonRow({ user, children }: { user: User; children?: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <Link href={`/u/${user.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={user.displayName} size={40} />
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium">{user.displayName}</span>
          <span className="block truncate font-mono text-[12px] text-fg-muted">@{user.handle}</span>
        </span>
      </Link>
      {children}
    </li>
  );
}

/** Your friends and the requests waiting on you. Only shown on your own profile. */
export function FriendsPanel() {
  const isReady = useFriendsHydration();
  const { friends, received, sent, accept, decline, cancelRequest } = useFriendsStore();

  if (!isReady) return <div className="h-32 rounded-card border border-line bg-raised" aria-busy="true" />;

  const incoming = byIds(received);
  const outgoing = byIds(sent);
  const mine = byIds(friends);

  return (
    <div className="flex flex-col gap-4">
      <section
        className={`rounded-card border bg-raised px-4 sm:px-5 ${incoming.length > 0 ? "border-accent/40" : "border-line"}`}
      >
        <h2 className="flex items-baseline justify-between pt-4 text-[14px] font-medium">
          Requests sent to you
          <span className={`font-mono text-[12px] font-normal ${incoming.length > 0 ? "text-accent" : "text-fg-muted"}`}>
            {incoming.length}
          </span>
        </h2>
        {incoming.length > 0 ? (
          <ul className="divide-y divide-line">
            {incoming.map((u) => (
              <PersonRow key={u.id} user={u}>
                <Button size="compact" onClick={() => accept(u.id)}>Accept</Button>
                <Button variant="ghost" size="compact" onClick={() => decline(u.id)}>Decline</Button>
              </PersonRow>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-[13px] text-fg-muted">No one is waiting on you right now</p>
        )}
      </section>

      <section className="rounded-card border border-line bg-raised px-4 sm:px-5">
        <h2 className="flex items-baseline justify-between pt-4 text-[14px] font-medium">
          Friends
          <span className="font-mono text-[12px] font-normal text-fg-muted">{mine.length}</span>
        </h2>
        {mine.length > 0 ? (
          <ul className="divide-y divide-line">
            {mine.map((u) => (
              <PersonRow key={u.id} user={u} />
            ))}
          </ul>
        ) : (
          <p className="py-6 text-[14px] text-fg-muted">No friends yet. Open someone&apos;s profile and add them</p>
        )}
      </section>

      {outgoing.length > 0 && (
        <section className="rounded-card border border-line bg-raised px-4 sm:px-5">
          <h2 className="pt-4 text-[14px] font-medium">Sent requests</h2>
          <ul className="divide-y divide-line">
            {outgoing.map((u) => (
              <PersonRow key={u.id} user={u}>
                <Button variant="ghost" size="compact" onClick={() => cancelRequest(u.id)}>Cancel</Button>
              </PersonRow>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
