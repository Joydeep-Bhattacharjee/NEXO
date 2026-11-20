"use client";

import { useState, type FormEvent } from "react";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  GLYPH_KEYS,
  IDENTITY_HUES,
  NAME_MAX,
  pickRandom,
  randomIdentityName,
  validateIdentityName,
  type GlyphKey,
} from "@/lib/anon-identity";
import { MAX_IDENTITIES, useAnonStore } from "@/lib/anon-store";
import { GLYPHS, IdentityAvatar } from "./IdentityAvatar";

type Props = {
  isFirst?: boolean;
  onDone?: () => void;
};

/** Make a new anonymous identity: a name, a color and a glyph. Nothing links it to the main account. */
export function CreateIdentity({ isFirst, onDone }: Props) {
  const createIdentity = useAnonStore((s) => s.createIdentity);
  const count = useAnonStore((s) => s.identities.length);
  const [name, setName] = useState(randomIdentityName);
  const [hue, setHue] = useState<string>(() => pickRandom(IDENTITY_HUES));
  const [glyph, setGlyph] = useState<GlyphKey>(() => pickRandom(GLYPH_KEYS));
  const [isTouched, setIsTouched] = useState(false);

  const error = validateIdentityName(name);
  const isFull = count >= MAX_IDENTITIES;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsTouched(true);
    if (error || isFull) return;
    if (createIdentity({ name, hue, glyph })) onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="card-rise rounded-[20px] border border-line bg-raised p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <IdentityAvatar hue={hue} glyph={glyph} size={88} />
        <h1 className="mt-6 font-display text-[36px] font-bold leading-tight">
          {isFirst ? "Who are you in here?" : "New identity"}
        </h1>
        <p className="mt-2 max-w-sm text-[14px] leading-5 text-fg-muted">
          Pick a name nobody can trace back to you. Your main profile, friends and other identities never show here
        </p>
      </div>

      <label className="mt-8 flex flex-col gap-2 text-[13px] text-fg-muted">
        Name
        <span className="flex gap-2">
          <input
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setIsTouched(true)}
            aria-invalid={Boolean(isTouched && error)}
            className={`h-11 min-w-0 flex-1 rounded-btn border bg-overlay px-3 text-[15px] text-fg outline-none transition-colors focus:border-accent ${
              isTouched && error ? "border-danger" : "border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setName(randomIdentityName())}
            aria-label="Roll a random name"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn border border-line text-fg-muted transition-colors hover:border-line-hover hover:text-fg cursor-pointer"
          >
            <Dices size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </span>
        {isTouched && error && <span className="text-[12px] text-danger">{error}</span>}
      </label>

      <fieldset className="mt-6">
        <legend className="text-[13px] text-fg-muted">Color</legend>
        <div className="mt-2 flex gap-3">
          {IDENTITY_HUES.map((h) => (
            <button
              key={h}
              type="button"
              aria-label={`Color ${h}`}
              aria-pressed={hue === h}
              onClick={() => setHue(h)}
              className="h-8 w-8 rounded-full transition-transform duration-150 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: h,
                boxShadow: hue === h ? `0 0 0 2px var(--bg-raised), 0 0 0 4px ${h}` : undefined,
              }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[13px] text-fg-muted">Glyph</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {GLYPH_KEYS.map((g) => {
            const Icon = GLYPHS[g];
            const isPicked = glyph === g;
            return (
              <button
                key={g}
                type="button"
                aria-label={`Glyph ${g}`}
                aria-pressed={isPicked}
                onClick={() => setGlyph(g)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                  isPicked ? "border-transparent bg-overlay" : "border-line text-fg-muted hover:text-fg"
                }`}
                style={isPicked ? { color: hue, boxShadow: `inset 0 0 0 1px ${hue}` } : undefined}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden />
              </button>
            );
          })}
        </div>
      </fieldset>

      <Button type="submit" className="mt-8 w-full" disabled={isFull}>
        {isFull ? `You have ${MAX_IDENTITIES} identities, retire one first` : `Enter as ${name.trim() || "…"}`}
      </Button>
    </form>
  );
}
