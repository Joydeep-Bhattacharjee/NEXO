import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "mask";
type Size = "default" | "compact";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-press font-medium",
  secondary: "bg-overlay border border-line text-fg hover:border-line-hover",
  ghost: "bg-transparent text-fg-muted hover:bg-overlay hover:text-fg",
  danger: "bg-transparent border border-danger/40 text-danger hover:bg-danger/10 font-medium",
  mask: "bg-mask/15 border border-mask/40 text-mask hover:bg-mask/25 font-medium",
};

const SIZE_CLASSES: Record<Size, string> = {
  default: "h-11 px-5 text-[15px]",
  compact: "h-9 px-4 text-[13px]",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-btn transition-[color,background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    />
  );
}
