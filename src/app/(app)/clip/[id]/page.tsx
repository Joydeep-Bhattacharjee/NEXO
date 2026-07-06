import { notFound } from "next/navigation";
import { FeedCard } from "@/components/feed/FeedCard";
import { FEED_POSTS } from "@/lib/mock-data";

/** Clip watch page — player + comments under the same card layout. */
export default async function ClipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = FEED_POSTS.find((p) => p.id === id && p.kind === "clip");
  if (!post) notFound();

  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-4">
      <FeedCard post={post} />
      <div className="flex items-center gap-2 rounded-card border border-line bg-raised p-3">
        <input
          placeholder="Add a comment…"
          className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none focus:border-accent"
        />
      </div>
      <p className="text-center text-[13px] text-fg-muted">
        Comments load here — mock MVP.
      </p>
    </div>
  );
}
