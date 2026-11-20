"use client";

import { useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { ZoneComposer } from "@/components/anon/ZoneComposer";
import { ZoneThreadCard } from "@/components/anon/ZoneThreadCard";
import { Chip } from "@/components/ui/Chip";
import { useAnonStore } from "@/lib/anon-store";
import { allThreads, realmBySlug, realmLabel, type ZoneThread } from "@/lib/anon-threads";
import { formatCount } from "@/lib/mock-data";
import { avatarTint, initials } from "@/lib/tones";

const SORTS = ["Hot", "New", "Raid threads", "Top"] as const;
type Sort = (typeof SORTS)[number];

function sortThreads(threads: ZoneThread[], sort: Sort): ZoneThread[] {
  if (sort === "Raid threads") return threads.filter((t) => t.kind === "raid");
  if (sort === "New") return [...threads].sort((a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt));
  if (sort === "Top") return [...threads].sort((a, b) => b.respect - a.respect);
  const score = (t: ZoneThread) => t.respect + t.comments * 2;
  const yours = threads.filter((t) => t.isYours);
  const others = threads.filter((t) => !t.isYours).sort((a, b) => score(b) - score(a));
  return [...yours, ...others];
}

export default function ZoneRealmPage() {
  const { realm: slug } = useParams<{ realm: string }>();
  const realm = realmBySlug(slug);
  const posts = useAnonStore((s) => s.posts);
  const identities = useAnonStore((s) => s.identities);
  const [sort, setSort] = useState<Sort>("Hot");

  const threads = useMemo(
    () => sortThreads(allThreads(posts, identities).filter((t) => t.realmSlug === slug), sort),
    [posts, identities, slug, sort],
  );

  if (!realm) notFound();
  const label = realmLabel(slug);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-4 pb-2">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-[28px] font-bold"
          style={{ backgroundColor: avatarTint(realm.name) }}
          aria-hidden
        >
          {initials(label)}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-[36px] font-bold leading-tight">{label}</h1>
          <p className="mt-1 text-[14px] text-fg-muted">{realm.description}</p>
          <p className="mt-1 font-mono text-[12px] text-fg-muted">
            {formatCount(realm.maskCount)} identities · {realm.threadsPerDay} threads a day · {realm.game}
          </p>
        </div>
      </header>

      <div className="flex gap-1" role="tablist" aria-label="Sort threads">
        {SORTS.map((s) => (
          <Chip key={s} isActive={sort === s} onClick={() => setSort(s)}>
            {s}
          </Chip>
        ))}
      </div>

      <ZoneComposer realmSlug={slug} />

      {threads.map((t) => (
        <ZoneThreadCard key={t.id} thread={t} />
      ))}
      {threads.length === 0 && (
        <p className="py-12 text-center text-[14px] text-fg-muted">Nothing here yet. Start the first one</p>
      )}
    </div>
  );
}
