"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toaster";
import { useAppStore } from "@/lib/app-store";
import { toSquarePhoto } from "@/lib/image";
import { CURRENT_USER } from "@/lib/mock-data";

type Props = {
  size?: number;
  showRemove?: boolean;
};

/** Your avatar with a camera button. Picks an image, crops it square, and saves it on this device. */
export function PhotoPicker({ size = 80, showRemove = true }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const myPhoto = useAppStore((s) => s.myPhoto);
  const setMyPhoto = useAppStore((s) => s.setMyPhoto);
  const toast = useToast((s) => s.show);
  const [isBusy, setIsBusy] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsBusy(true);
    try {
      setMyPhoto(await toSquarePhoto(file));
      toast("Profile photo updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't use that image");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={myPhoto ? "Change profile photo" : "Add profile photo"}
        className="group relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
        disabled={isBusy}
      >
        <Avatar name={CURRENT_USER.displayName} size={size} />
        <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[color:var(--bg-raised)] bg-accent text-accent-ink transition-transform group-hover:scale-105">
          <Camera size={15} strokeWidth={1.75} aria-hidden />
        </span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" tabIndex={-1} />
      {showRemove && myPhoto && (
        <button
          type="button"
          onClick={() => {
            setMyPhoto(null);
            toast("Profile photo removed");
          }}
          className="flex items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-[12px] text-fg-muted hover:bg-overlay hover:text-danger cursor-pointer"
        >
          <Trash2 size={12} strokeWidth={1.5} aria-hidden />
          Remove
        </button>
      )}
    </div>
  );
}
