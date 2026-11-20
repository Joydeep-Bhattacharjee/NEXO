import { BadgeCheck, VenetianMask } from "lucide-react";

type Props = {
  name: string;
  badge?: string;
  size?: "sm" | "md";
};

/** A Mask's public face: the mask glyph, its name and an optional verified achievement. */
export function MaskTag({ name, badge, size = "sm" }: Props) {
  const text = size === "md" ? "text-[13px]" : "text-[12px]";
  return (
    <span className={`flex min-w-0 items-center gap-2 ${text}`}>
      <span className="flex min-w-0 items-center gap-1.5 text-mask">
        <VenetianMask size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
        <span className="truncate font-medium">{name}</span>
      </span>
      {badge && (
        <span className="flex shrink-0 items-center gap-1 text-fg-muted">
          <BadgeCheck size={14} strokeWidth={1.5} aria-hidden className="text-mask" />
          {badge.replace(/^✓\s*/, "")}
        </span>
      )}
    </span>
  );
}
