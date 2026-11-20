"use client";

import Link from "next/link";
import { ServerMark } from "@/components/ui/ServerMark";
import { useAppHydration, useAppStore } from "@/lib/app-store";
import { formatCount, SERVERS } from "@/lib/mock-data";

/** The left rail's server list, kept in step with Join and Leave. */
export function RailServers() {
  const isReady = useAppHydration();
  const joined = useAppStore((s) => s.joined);
  const list = SERVERS.filter((s) => !s.parentSlug && (isReady ? joined[s.slug] : s.joined));

  return (
    <ul className="flex flex-col gap-0.5">
      {list.map((s) => (
        <li key={s.id}>
          <Link href={`/s/${s.slug}`} className="flex h-10 items-center gap-2.5 rounded-btn px-2 text-[14px] transition-colors hover:bg-raised">
            <ServerMark name={s.name} size={24} />
            <span className="min-w-0 flex-1 truncate">{s.name}</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {formatCount(s.online)}
            </span>
          </Link>
        </li>
      ))}
      {list.length === 0 && <li className="px-2 py-2 text-[13px] text-fg-muted">No servers yet</li>}
    </ul>
  );
}
