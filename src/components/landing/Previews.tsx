import { ChevronUp, MessageCircle } from "lucide-react";
import { FeedCard } from "@/components/feed/FeedCard";
import { ClipThumb } from "@/components/media/ClipThumb";
import { MaskTag } from "@/components/realms/MaskTag";
import { CHANNEL_ICONS } from "@/components/servers/channelIcons";
import { ServerMark } from "@/components/ui/ServerMark";
import { FEED_POSTS, formatCount, REALM_THREADS, SERVERS } from "@/lib/mock-data";

const PANEL = "rounded-[20px] border border-line bg-base p-3 shadow-[0_24px_64px_rgba(0,0,0,0.35)]";

function ThreadCard({ index }: { index: number }) {
  const thread = REALM_THREADS[index];
  return (
    <div className="rounded-card border border-line bg-raised p-4">
      <MaskTag name={thread.maskName} badge={thread.maskBadge} />
      <p className="mt-2 text-[14px] font-medium leading-5">{thread.title}</p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-fg-muted">{thread.body}</p>
      <div className="mt-3 flex gap-4 font-mono text-[12px] text-fg-muted">
        <span className="flex items-center gap-1 text-mask">
          <ChevronUp size={14} strokeWidth={1.5} aria-hidden />
          {formatCount(thread.respect)} respect
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} strokeWidth={1.5} aria-hidden />
          {formatCount(thread.comments)}
        </span>
      </div>
    </div>
  );
}

/** Hero visual: the real feed card and a Realm thread, the two halves of the promise. */
export function HeroPreview() {
  return (
    <div className={`${PANEL} relative`} aria-hidden>
      <div className="pointer-events-none select-none">
        <FeedCard post={FEED_POSTS[0]} />
      </div>
      <div className="pointer-events-none mt-3 select-none sm:ml-16">
        <ThreadCard index={0} />
      </div>
    </div>
  );
}

const CLIP_GAMES = ["Free Fire", "Valorant", "PUBG / BGMI", "Clash of Clans"] as const;
const CLIP_TIMES = ["0:41", "0:24", "0:18", "0:33"] as const;

export function ClipsPreview() {
  return (
    <div className={`${PANEL} grid grid-cols-2 gap-2`} aria-hidden>
      {CLIP_GAMES.map((game, i) => (
        <ClipThumb key={game} game={game} duration={CLIP_TIMES[i]} />
      ))}
    </div>
  );
}

export function ServerPreview() {
  const server = SERVERS[0];
  return (
    <div className={PANEL} aria-hidden>
      <div className="rounded-card border border-line bg-raised p-3">
        <div className="flex items-center gap-2.5 px-1 pb-3">
          <ServerMark name={server.name} size={28} />
          <span className="flex-1 truncate text-[14px] font-medium">{server.name}</span>
          <span className="font-mono text-[12px] text-fg-muted">{formatCount(server.online)} online</span>
        </div>
        <ul className="flex flex-col gap-0.5">
          {server.channels.map((c, i) => {
            const Icon = CHANNEL_ICONS[c.type];
            return (
              <li
                key={c.id}
                className={`flex h-9 items-center gap-2.5 rounded-btn px-2 text-[13px] ${
                  i === 2 ? "bg-overlay text-fg" : "text-fg-muted"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {c.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function RealmPreview() {
  return (
    <div className={`${PANEL} flex flex-col gap-3`} aria-hidden>
      <ThreadCard index={1} />
      <ThreadCard index={4} />
    </div>
  );
}
