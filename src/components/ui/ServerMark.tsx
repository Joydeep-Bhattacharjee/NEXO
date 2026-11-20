import { avatarTint, initials } from "@/lib/tones";

/** Square server mark: two-letter monogram on the server's own tint. */
export function ServerMark({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-[8px] font-display font-bold text-fg"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        backgroundColor: avatarTint(name),
      }}
    >
      {initials(name)}
    </span>
  );
}
