import { Play } from "lucide-react";
import { gameTone } from "@/lib/tones";

type Props = {
  game: string;
  duration?: string;
  meta?: string;
  isLive?: boolean;
  className?: string;
};

/**
 * Stand-in for clip and stream art until real thumbnails ship. The game's own light
 * rises from the bottom and its name sits large and dim, like a loading screen.
 */
export function ClipThumb({ game, duration, meta, isLive, className = "" }: Props) {
  const tone = gameTone(game);
  return (
    <span
      className={`relative flex aspect-video w-full overflow-hidden rounded-[10px] bg-[#090b0f] [container-type:inline-size] ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, color-mix(in oklab, ${tone} 30%, transparent), transparent 72%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-[24%] h-px"
        style={{ background: `color-mix(in oklab, ${tone} 50%, transparent)` }}
      />
      <span
        aria-hidden
        className="absolute bottom-[6%] left-[4%] whitespace-nowrap font-display text-[11cqw] font-extrabold leading-none text-white/10"
      >
        {game}
      </span>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#0f1c1a] transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          <Play size={18} strokeWidth={1.5} fill="currentColor" aria-hidden />
        </span>
      </span>

      {isLive && (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-[4px] bg-live px-1.5 text-[11px] font-medium leading-5 text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
          Live
        </span>
      )}
      {duration && (
        <span className="absolute right-3 top-3 rounded-[4px] bg-black/70 px-1.5 font-mono text-[11px] leading-5 text-white/90">
          {duration}
        </span>
      )}
      {meta && (
        <span className="absolute bottom-3 right-3 rounded-[4px] bg-black/70 px-1.5 font-mono text-[11px] leading-5 text-white/90">
          {meta}
        </span>
      )}
    </span>
  );
}
