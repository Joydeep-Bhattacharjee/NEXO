import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount, STREAMS } from "@/lib/mock-data";
import { ClipThumb } from "@/components/media/ClipThumb";
import { StreamActions, StreamChat } from "@/components/live/StreamRoom";

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
        <ClipThumb
          game={stream.game}
          isLive
          meta={`${stream.mode === "interactive" ? "<1s" : "3–5s"} delay`}
          className="rounded-card"
        />
        {/* streamer card */}
        <div className="mt-3 flex items-center gap-3 rounded-card border border-line bg-raised p-4">
          <Avatar size={48} isLive name={stream.streamer} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{stream.title}</p>
            <p className="font-mono text-[12px] text-fg-muted">
              {stream.streamer} · {stream.game} · {formatCount(stream.viewers)} watching
            </p>
          </div>
          <StreamActions stream={stream} />
        </div>
      </div>

      <StreamChat handle={stream.streamerHandle} seed={CHAT} />
    </div>
  );
}
