import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

/** Filter chip — feed game filters, search tabs, sort tabs. */
export function Chip({ isActive, className = "", ...rest }: Props) {
  return (
    <button
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-150 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isActive
          ? "border-accent bg-accent/10 text-accent"
          : "border-line text-fg-muted hover:border-line-hover hover:text-fg"
      } ${className}`}
      {...rest}
    />
  );
}
