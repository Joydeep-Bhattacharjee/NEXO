type Props = {
  emoji: string;
  size?: number;
  isLive?: boolean;
  isMask?: boolean;
  label?: string;
};

/** Circle avatar (§4.3): live streamers get a red ring + LIVE pill, Masks get a purple ring + 🎭 badge. */
export function Avatar({ emoji, size = 40, isLive, isMask, label }: Props) {
  const ring = isLive
    ? "ring-2 ring-live"
    : isMask
      ? "ring-2 ring-mask"
      : "ring-1 ring-line";
  return (
    <span
      className="relative inline-flex shrink-0"
      role="img"
      aria-label={label ?? "avatar"}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-overlay ${ring}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {emoji}
      </span>
      {isLive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-live px-1.5 text-[9px] font-bold uppercase leading-4 text-white">
          Live
        </span>
      )}
      {isMask && (
        <span className="absolute -bottom-0.5 -right-0.5 text-[11px]" aria-hidden>
          🎭
        </span>
      )}
    </span>
  );
}
