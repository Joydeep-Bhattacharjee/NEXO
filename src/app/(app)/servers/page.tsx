"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { ServerMark } from "@/components/ui/ServerMark";
import { useToast } from "@/components/ui/Toaster";
import { useAppHydration, useAppStore } from "@/lib/app-store";
import { formatCount, SERVERS, type Server } from "@/lib/mock-data";

function ServerRow({ server, isJoined, indent = false }: { server: Server; isJoined: boolean; indent?: boolean }) {
  const setJoined = useAppStore((s) => s.setJoined);
  const toast = useToast((s) => s.show);
  return (
    <li className={indent ? "ml-8 sm:ml-12" : ""}>
      <div className="flex items-center gap-3 rounded-card border border-line bg-raised p-4 transition-colors hover:border-line-hover">
        <Link href={`/s/${server.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
          <ServerMark name={server.name} size={40} />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-medium">{server.name}</span>
            <span className="flex items-center gap-2 font-mono text-[12px] text-fg-muted">
              {formatCount(server.members + (isJoined && !server.joined ? 1 : 0))} members
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {formatCount(server.online)}
              </span>
            </span>
          </span>
        </Link>
        {isJoined ? (
          <>
            <Button
              variant="ghost"
              size="compact"
              onClick={() => {
                setJoined(server.slug, false);
                toast(`Left ${server.name}`);
              }}
            >
              Leave
            </Button>
            <Link href={`/s/${server.slug}`}>
              <Button variant="secondary" size="compact">Open</Button>
            </Link>
          </>
        ) : (
          <Button
            size="compact"
            onClick={() => {
              setJoined(server.slug, true);
              toast(`Joined ${server.name}`);
            }}
          >
            Join
          </Button>
        )}
      </div>
    </li>
  );
}

/** §3.5 — Your servers and popular ones; sub-servers indented under parents. */
export default function ServersPage() {
  const isReady = useAppHydration();
  const joinedMap = useAppStore((s) => s.joined);
  const isJoined = (s: Server) => (isReady ? Boolean(joinedMap[s.slug]) : s.joined);
  const parents = SERVERS.filter((s) => !s.parentSlug);
  const childrenOf = (slug: string) => SERVERS.filter((s) => s.parentSlug === slug);
  const mine = parents.filter(isJoined);
  const popular = parents.filter((s) => !isJoined(s));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="font-display text-[36px] font-bold leading-tight">Your servers</h1>
        <ul className="mt-4 flex flex-col gap-3">
          {mine.map((s) => (
            <Fragment key={s.id}>
              <ServerRow server={s} isJoined />
              {childrenOf(s.slug).map((c) => (
                <ServerRow key={c.id} server={c} isJoined={isJoined(c)} indent />
              ))}
            </Fragment>
          ))}
          {mine.length === 0 && <li className="py-6 text-[14px] text-fg-muted">You haven&apos;t joined any servers yet</li>}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-[28px] font-bold leading-tight">Popular</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {popular.map((s) => (
            <ServerRow key={s.id} server={s} isJoined={false} />
          ))}
        </ul>
      </section>
    </div>
  );
}
