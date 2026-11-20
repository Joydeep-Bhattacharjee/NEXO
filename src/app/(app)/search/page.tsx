"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Clock, Search, VenetianMask, X } from "lucide-react";
import { ClipThumb } from "@/components/media/ClipThumb";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { ServerMark } from "@/components/ui/ServerMark";
import { useAppHydration, useAppStore } from "@/lib/app-store";
import { formatCount, getUser, PUBLIC_POSTS, REALMS, SERVERS, STREAMS, USERS } from "@/lib/mock-data";

const TABS = ["All", "Users", "Servers", "Realms", "Clips", "Streams"] as const;
type Tab = (typeof TABS)[number];

const ROW = "flex items-center gap-3 rounded-card border border-line bg-raised p-3 transition-colors hover:border-line-hover";
const H2 = "pb-2 text-[13px] font-medium text-fg-muted";

function matches(query: string, ...fields: (string | undefined)[]): boolean {
  return fields.some((f) => f?.toLowerCase().includes(query));
}

function RecentSearches() {
  const router = useRouter();
  const isReady = useAppHydration();
  const recents = useAppStore((s) => s.recentSearches);
  const addRecent = useAppStore((s) => s.addRecentSearch);
  const removeRecent = useAppStore((s) => s.removeRecentSearch);
  const clearRecents = useAppStore((s) => s.clearRecentSearches);

  if (!isReady) return null;
  if (recents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-fg-muted">
        <Search size={24} strokeWidth={1.5} aria-hidden />
        <p className="text-[14px]">Search for players, servers, Realms, clips and streams</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="recent-heading">
      <div className="flex items-center justify-between pb-2">
        <h2 id="recent-heading" className="text-[13px] font-medium text-fg-muted">
          Recent searches
        </h2>
        <button
          onClick={clearRecents}
          className="rounded-[6px] px-1.5 py-0.5 text-[12px] text-fg-muted hover:bg-overlay hover:text-fg cursor-pointer"
        >
          Clear all
        </button>
      </div>
      <ul className="flex flex-col gap-1">
        {recents.map((r) => (
          <li key={r} className="flex items-center rounded-btn border border-line bg-raised">
            <button
              onClick={() => {
                addRecent(r);
                router.replace(`/search?q=${encodeURIComponent(r)}`);
              }}
              className="flex h-11 min-w-0 flex-1 items-center gap-3 px-3 text-left text-[14px] cursor-pointer"
            >
              <Clock size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-fg-muted" />
              <span className="truncate">{r}</span>
            </button>
            <button
              onClick={() => removeRecent(r)}
              aria-label={`Remove ${r} from recent searches`}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-[6px] text-fg-muted hover:bg-overlay hover:text-fg cursor-pointer"
            >
              <X size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Results({ q }: { q: string }) {
  const [tab, setTab] = useState<Tab>("All");
  const addRecent = useAppStore((s) => s.addRecentSearch);
  const myPosts = useAppStore((s) => s.myPosts);
  const query = q.toLowerCase();
  const remember = () => addRecent(q);
  const show = (t: Tab) => tab === "All" || tab === t;

  const users = USERS.filter((u) => matches(query, u.displayName, u.handle, ...u.gameTags));
  const servers = SERVERS.filter((s) => matches(query, s.name));
  const realms = REALMS.filter((r) => matches(query, r.name, r.game, r.description));
  const clips = [...myPosts, ...PUBLIC_POSTS].filter(
    (p) => p.kind === "clip" && matches(query, p.body, p.game, getUser(p.authorId)?.displayName),
  );
  const streams = STREAMS.filter((s) => matches(query, s.streamer, s.title, s.game));
  const total = users.length + servers.length + realms.length + clips.length + streams.length;

  return (
    <>
      <div className="rail-scroll flex gap-1 overflow-x-auto" role="tablist" aria-label="Result types">
        {TABS.map((t) => (
          <Chip key={t} isActive={tab === t} onClick={() => setTab(t)}>
            {t}
          </Chip>
        ))}
      </div>

      {total === 0 && (
        <p className="py-12 text-center text-[14px] text-fg-muted">Nothing found for &ldquo;{q}&rdquo;</p>
      )}

      {show("Users") && users.length > 0 && (
        <section>
          <h2 className={H2}>People</h2>
          <ul className="flex flex-col gap-2">
            {users.map((u) => (
              <li key={u.id}>
                <Link href={`/u/${u.handle}`} onClick={remember} className={ROW}>
                  <Avatar size={36} isLive={u.isLive} name={u.displayName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{u.displayName}</span>
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

      {show("Servers") && servers.length > 0 && (
        <section>
          <h2 className={H2}>Servers</h2>
          <ul className="flex flex-col gap-2">
            {servers.map((s) => (
              <li key={s.id}>
                <Link href={`/s/${s.slug}`} onClick={remember} className={ROW}>
                  <ServerMark name={s.name} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{s.name}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">{formatCount(s.members)} members</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {show("Realms") && realms.length > 0 && (
        <section>
          <h2 className={H2}>Realms</h2>
          <ul className="flex flex-col gap-2">
            {realms.map((r) => (
              <li key={r.slug}>
                <Link href={`/anon/${r.slug}`} onClick={remember} className={ROW}>
                  <VenetianMask size={18} strokeWidth={1.5} aria-hidden className="text-mask" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.name.replace(/-/g, " ")}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">
                      {formatCount(r.maskCount)} identities · {r.game}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {show("Clips") && clips.length > 0 && (
        <section>
          <h2 className={H2}>Clips</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {clips.map((c) => (
              <li key={c.id}>
                <Link href={`/clip/${c.id}`} onClick={remember} className="group block">
                  <ClipThumb game={c.game} meta={c.views ? `${formatCount(c.views)} views` : undefined} />
                  <p className="mt-2 line-clamp-2 text-[14px] leading-5">{c.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {show("Streams") && streams.length > 0 && (
        <section>
          <h2 className={H2}>Live streams</h2>
          <ul className="flex flex-col gap-2">
            {streams.map((st) => (
              <li key={st.id}>
                <Link href={`/live/${st.streamerHandle}`} onClick={remember} className={ROW}>
                  <Avatar size={36} isLive name={st.streamer} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{st.title}</span>
                    <span className="block truncate text-[12px] text-fg-muted">
                      {st.streamer} · {st.game} · {formatCount(st.viewers)} watching
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function SearchContent() {
  const q = (useSearchParams().get("q") ?? "").trim();
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      {q ? <Results key={q} q={q} /> : <RecentSearches />}
    </div>
  );
}

/** §3.12 — results for whatever is typed in the top bar's search box. */
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
