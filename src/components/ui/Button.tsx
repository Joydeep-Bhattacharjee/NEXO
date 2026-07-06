import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "mask";
type Size = "default" | "compact";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-press font-semibold",
  secondary:
    "bg-transparent border border-line text-fg hover:border-line-hover",
  ghost: "bg-transparent text-accent hover:bg-overlay",
  danger: "bg-danger text-white hover:opacity-90 font-semibold",
  mask: "bg-mask text-white hover:opacity-90 font-semibold",
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
      className={`inline-flex items-center justify-center gap-2 rounded-btn transition-all duration-150 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    />
  );
}
