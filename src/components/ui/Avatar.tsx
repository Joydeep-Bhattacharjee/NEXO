"use client";

import { VenetianMask } from "lucide-react";
import { useAppHydration, useAppStore } from "@/lib/app-store";
import { CURRENT_USER } from "@/lib/mock-data";

type Props = {
  name: string;
  size?: number;
  isLive?: boolean;
  isMask?: boolean;
  /** A profile photo URL. Without one the avatar stays a plain white circle until the person adds a photo. */
  src?: string | null;
};

/** Circle avatar: the person's photo, or blank white until they add one. Masks show the mask glyph. */
export function Avatar({ name, size = 40, isLive, isMask, src }: Props) {
  const isReady = useAppHydration();
  const myPhoto = useAppStore((s) => s.myPhoto);
  const photo = src ?? (isReady && name === CURRENT_USER.displayName ? myPhoto : null);
  const ring = isLive ? "ring-2 ring-live ring-offset-2 ring-offset-raised" : "";

  return (
    <span className="relative inline-flex shrink-0" role="img" aria-label={name}>
      {isMask ? (
        <span
          className="flex items-center justify-center rounded-full bg-mask/15 text-mask"
          style={{ width: size, height: size }}
        >
          <VenetianMask size={Math.round(size * 0.5)} strokeWidth={1.5} aria-hidden />
        </span>
      ) : photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- local data URL, nothing for next/image to optimize
        <img
          src={photo}
          alt=""
          width={size}
          height={size}
          className={`rounded-full object-cover ${ring}`}
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className={`block rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(15,28,26,0.12)] ${ring}`}
          style={{ width: size, height: size }}
        />
      )}
      {isLive && size >= 32 && (
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-[4px] bg-live px-1 text-[10px] font-medium leading-4 text-white">
          Live
        </span>
      )}
    </span>
  );
}
