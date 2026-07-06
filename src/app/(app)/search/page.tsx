"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { formatCount, REALMS, SERVERS, USERS } from "@/lib/mock-data";

const TABS = ["All", "Users", "Servers", "Realms", "Clips", "Streams"];

/** §3.12 — omnibox + tabbed results, Bengali + English. */
export default function SearchPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("All");
  const query = q.toLowerCase();

  const users = USERS.filter((u) => u.displayName.toLowerCase().includes(query));
  const servers = SERVERS.filter((s) => s.name.toLowerCase().includes(query));
  const realms = REALMS.filter((r) => r.name.toLowerCase().includes(query));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search users, servers, realms… (EN / বাংলা)"
        aria-label="Search"
        className="h-12 rounded-btn border border-line bg-overlay px-4 text-[15px] outline-none transition-colors focus:border-accent"
      />
      <div className="rail-scroll flex gap-2 overflow-x-auto" role="tablist" aria-label="Result types">
        {TABS.map((t) => (
          <Chip key={t} isActive={tab === t} onClick={() => setTab(t)}>
            {t}
          </Chip>
        ))}
      </div>

      {(tab === "All" || tab === "Users") && users.length > 0 && (
        <section>
          <h2 className="pb-2 text-[12px] font-semibold uppercase tracking-wide text-fg-muted">Users</h2>
          <ul className="flex flex-col gap-2">
            {users.map((u) => (
              <li key={u.id}>
                <Link href={`/u/${u.handle}`} className="flex items-center gap-3 rounded-card border border-line bg-raised p-3 transition-colors hover:border-line-hover">
                  <Avatar emoji={u.avatar} size={36} isLive={u.isLive} label={u.displayName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{u.displayName}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">
                      @{u.handle} · {formatCount(u.followers)} followers
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(tab === "All" || tab === "Servers") && servers.length > 0 && (
        <section>
          <h2 className="pb-2 text-[12px] font-semibold uppercase tracking-wide text-fg-muted">Servers</h2>
          <ul className="flex flex-col gap-2">
            {servers.map((s) => (
              <li key={s.id}>
                <Link href={`/s/${s.slug}`} className="flex items-center gap-3 rounded-card border border-line bg-raised p-3 transition-colors hover:border-line-hover">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-overlay">{s.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{s.name}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">{formatCount(s.members)} members</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(tab === "All" || tab === "Realms") && realms.length > 0 && (
        <section>
          <h2 className="pb-2 text-[12px] font-semibold uppercase tracking-wide text-fg-muted">Realms</h2>
          <ul className="flex flex-col gap-2">
            {realms.map((r) => (
              <li key={r.slug}>
                <Link href={`/r/${r.slug}`} className="flex items-center gap-3 rounded-card border border-line bg-raised p-3 transition-colors hover:border-mask">
                  <span aria-hidden>🎭</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-mask">r/{r.name}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">{formatCount(r.maskCount)} masks</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
