import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatCount, STREAMS } from "@/lib/mock-data";

const CHAT: { name: string; body: string }[] = [
  { name: "gg_rakib", body: "that rotation was clean 🔥" },
  { name: "meowlord", body: "play zone edge next time" },
  { name: "sadia.play", body: "GRANDMASTER SOON" },
  { name: "tanvirgg", body: "clip that last fight someone" },
];

/** §3.8 — Stream room: player, chat, streamer card, Clip last 30s. */
export default async function StreamRoomPage({
  params,
}: {
  params: Promise<{ streamer: string }>;
}) {
  const { streamer } = await params;
  const stream = STREAMS.find((s) => s.streamerHandle === streamer);
  if (!stream) notFound();

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="min-w-0 flex-[7]">
        {/* player */}
        <div className="relative flex aspect-video items-center justify-center rounded-card border border-line bg-base text-6xl">
          {stream.avatar}
          <span className="absolute left-3 top-3 rounded bg-live px-2 py-0.5 text-[11px] font-bold uppercase text-white">
            ● Live · {stream.mode === "interactive" ? "<1s" : "3–5s"}
          </span>
        </div>
        {/* streamer card */}
        <div className="mt-3 flex items-center gap-3 rounded-card border border-line bg-raised p-4">
          <Avatar emoji={stream.avatar} size={48} isLive label={stream.streamer} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{stream.title}</p>
            <p className="font-mono text-[12px] text-fg-muted">
              {stream.streamer} · {stream.game} · {formatCount(stream.viewers)} watching
            </p>
          </div>
          <Button size="compact">Follow</Button>
          <Button variant="secondary" size="compact">
            🎬 Clip last 30s
          </Button>
        </div>
      </div>

      {/* chat */}
      <aside className="flex h-80 flex-[3] flex-col rounded-card border border-line bg-raised lg:h-auto">
        <header className="flex h-11 items-center justify-between border-b border-line px-3 text-[13px] font-semibold">
          Stream chat
          <span className="font-mono text-[11px] font-normal text-fg-muted">slow mode</span>
        </header>
        <ul className="rail-scroll flex-1 space-y-2 overflow-y-auto p-3 text-[13px]">
          {CHAT.map((c, i) => (
            <li key={i}>
              <span className="font-semibold text-accent">{c.name}</span>{" "}
              <span>{c.body}</span>
            </li>
          ))}
        </ul>
        <footer className="border-t border-line p-2">
          <input
            placeholder="Chat…"
            className="h-9 w-full rounded-btn border border-transparent bg-overlay px-3 text-[13px] outline-none focus:border-accent"
          />
        </footer>
      </aside>
    </div>
  );
}
