import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

/** Filter chip: feed filters, search tabs, sort tabs. Selection is a surface step, not a color. */
export function Chip({ isActive, className = "", ...rest }: Props) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-[13px] transition-colors duration-150 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isActive
          ? "bg-overlay text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "text-fg-muted hover:bg-overlay/60 hover:text-fg"
      } ${className}`}
      {...rest}
    />
  );
}
