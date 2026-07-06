import { notFound } from "next/navigation";
import { MaskBanner } from "@/components/realms/MaskBanner";
import { formatCount, REALM_THREADS, THREAD_COMMENTS } from "@/lib/mock-data";

/** §3.7 — Thread page: nested comments (max depth 6), Respect, verified badges. */
export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const thread = REALM_THREADS.find((t) => t.id === id && t.realmSlug === slug);
  if (!thread) notFound();

  return (
    <div className="flex max-w-[680px] flex-col gap-4">
      <MaskBanner realmSlug={slug} />

      <article className="rounded-card border border-line bg-raised p-5">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-mask">
            {thread.maskAvatar} {thread.maskName}
          </span>
          {thread.maskBadge && (
            <span className="rounded bg-mask/15 px-1.5 py-0.5 text-[11px] font-medium text-mask">
              {thread.maskBadge}
            </span>
          )}
          {thread.type === "raid" && thread.expiresIn && (
            <span className="rounded bg-warning/15 px-1.5 py-0.5 font-mono text-[11px] text-warning">
              ⏳ archives in {thread.expiresIn}
            </span>
          )}
        </div>
        <h1 className="mt-2 font-display text-xl font-bold">{thread.title}</h1>
        <p className="mt-2 text-[15px] leading-[22px]">{thread.body}</p>
        {thread.aiSummary && (
          <p className="mt-3 rounded-[10px] border border-accent/30 bg-accent/5 p-3 text-[13px]">
            <span className="font-semibold text-accent">✨ Pinned AI summary:</span>{" "}
            {thread.aiSummary}
          </p>
        )}
        <div className="mt-3 flex gap-4 font-mono text-[13px] text-fg-muted">
          <span className="text-mask">▲ {formatCount(thread.respect)} respect</span>
          <span>💬 {formatCount(thread.comments)}</span>
        </div>
      </article>

      {/* composer */}
      <div className="flex items-center gap-2 rounded-card border border-line bg-raised p-3">
        <span aria-hidden>🎭</span>
        <input
          placeholder="Reply as your Mask…"
          className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none transition-colors focus:border-mask"
        />
      </div>

      {/* comments */}
      <ul className="flex flex-col gap-3">
        {THREAD_COMMENTS.map((c) => (
          <li key={c.id} style={{ marginLeft: Math.min(c.depth, 6) * 20 }}>
            <div
              className={`rounded-card border border-line bg-raised p-4 ${
                c.depth > 0 ? "border-l-2 border-l-mask/40" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-mask">
                  {c.maskAvatar} {c.maskName}
                </span>
                {c.maskBadge && (
                  <span className="rounded bg-mask/15 px-1.5 py-0.5 text-[11px] font-medium text-mask">
                    {c.maskBadge}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[14px] leading-[21px]">{c.body}</p>
              <div className="mt-2 flex gap-3 font-mono text-[12px] text-fg-muted">
                <span className="text-mask">▲ {c.respect}</span>
                <button className="cursor-pointer hover:text-fg">Reply</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
