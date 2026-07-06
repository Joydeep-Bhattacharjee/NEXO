import Link from "next/link";
import { notFound } from "next/navigation";
import { MaskBanner } from "@/components/realms/MaskBanner";
import { Chip } from "@/components/ui/Chip";
import { formatCount, REALM_THREADS, REALMS } from "@/lib/mock-data";

/** §3.7 — Realm page: Hot/New/Raid/Top tabs, thread list, Mask banner. */
export default async function RealmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const realm = REALMS.find((r) => r.slug === slug);
  if (!realm) notFound();
  const threads = REALM_THREADS.filter((t) => t.realmSlug === slug);

  return (
    <div className="flex flex-col gap-4">
      <MaskBanner realmSlug={slug} />
      <header>
        <h1 className="font-display text-2xl font-bold text-mask">r/{realm.name}</h1>
        <p className="mt-1 text-[13px] text-fg-muted">
          {realm.description} · 🎭 {formatCount(realm.maskCount)} masks
        </p>
      </header>

      <div className="flex gap-2" role="tablist" aria-label="Sort threads">
        {["Hot", "New", "Raid Threads", "Top"].map((t, i) => (
          <Chip key={t} isActive={i === 0}>
            {t}
          </Chip>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {threads.map((t) => (
          <li key={t.id}>
            <Link
              href={`/r/${slug}/${t.id}`}
              className="block rounded-card border border-line bg-raised p-4 transition-colors hover:border-mask"
            >
              <div className="flex items-center gap-2 text-[12px] text-fg-muted">
                <span className="text-mask">
                  {t.maskAvatar} {t.maskName}
                </span>
                {t.maskBadge && (
                  <span className="rounded bg-mask/15 px-1.5 py-0.5 text-[11px] font-medium text-mask">
                    {t.maskBadge}
                  </span>
                )}
                {t.type === "raid" && !t.aiSummary && (
                  <span className="rounded bg-warning/15 px-1.5 py-0.5 font-mono text-[11px] text-warning">
                    ⏳ RAID · {t.expiresIn} left
                  </span>
                )}
                {t.type === "poll" && <span className="rounded bg-overlay px-1.5 py-0.5 text-[11px]">📊 poll</span>}
              </div>
              <h2 className="mt-1.5 font-semibold">{t.title}</h2>
              {t.aiSummary ? (
                <p className="mt-2 rounded-[10px] border border-accent/30 bg-accent/5 p-2.5 text-[13px] text-fg-muted">
                  <span className="font-semibold text-accent">✨ AI summary:</span> {t.aiSummary}
                </p>
              ) : (
                <p className="mt-1 line-clamp-2 text-[13px] text-fg-muted">{t.body}</p>
              )}
              <div className="mt-2.5 flex gap-4 font-mono text-[12px] text-fg-muted">
                <span className="text-mask">▲ {formatCount(t.respect)} respect</span>
                <span>💬 {formatCount(t.comments)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
