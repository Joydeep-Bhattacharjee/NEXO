"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatCount, GAMES, SERVERS, USERS } from "@/lib/mock-data";

const MIN_GAMES = 3;
const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [joined, setJoined] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);

  const canContinue = step > 0 || picked.length >= MIN_GAMES;

  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function next() {
    if (step === TOTAL_STEPS - 1) {
      router.push("/home");
      return;
    }
    setStep(step + 1);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-10">
      {/* progress dots */}
      <div className="flex items-center justify-center gap-2" aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-2 rounded-full transition-all duration-200 ${
              i === step ? "w-6 bg-accent" : "w-2 bg-overlay"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <section className="mt-8">
          <h1 className="font-display text-2xl font-bold">What do you play?</h1>
          <p className="mt-1 text-fg-muted">
            Pick at least {MIN_GAMES} games — we&apos;ll build your feed around them.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {GAMES.map((g) => {
              const isPicked = picked.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => setPicked(toggle(picked, g.id))}
                  aria-pressed={isPicked}
                  className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-card border p-3 text-center transition-all duration-150 cursor-pointer ${
                    isPicked
                      ? "border-accent bg-accent/10"
                      : "border-line bg-raised hover:border-line-hover"
                  }`}
                >
                  <span className="text-3xl" aria-hidden>{g.cover}</span>
                  <span className="text-[12px] font-medium leading-tight">{g.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-8">
          <h1 className="font-display text-2xl font-bold">Join your first servers</h1>
          <p className="mt-1 text-fg-muted">Suggested for your games and region.</p>
          <ul className="mt-6 flex flex-col gap-3">
            {SERVERS.filter((s) => !s.parentSlug).slice(0, 5).map((s) => {
              const isJoined = joined.includes(s.id);
              return (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-card border border-line bg-raised p-4"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-card bg-overlay text-xl">
                    {s.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{s.name}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">
                      {formatCount(s.members)} members · {formatCount(s.online)} online
                    </span>
                  </span>
                  <Button
                    variant={isJoined ? "secondary" : "primary"}
                    size="compact"
                    onClick={() => setJoined(toggle(joined, s.id))}
                  >
                    {isJoined ? "Joined ✓" : "Join"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {step === 2 && (
        <section className="mt-8">
          <h1 className="font-display text-2xl font-bold">Follow some creators</h1>
          <p className="mt-1 text-fg-muted">Their clips and streams seed your feed.</p>
          <ul className="mt-6 flex flex-col gap-3">
            {USERS.slice(1).map((u) => {
              const isFollowed = followed.includes(u.id);
              return (
                <li
                  key={u.id}
                  className="flex items-center gap-3 rounded-card border border-line bg-raised p-4"
                >
                  <Avatar emoji={u.avatar} size={44} isLive={u.isLive} label={u.displayName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{u.displayName}</span>
                    <span className="block truncate text-[12px] text-fg-muted">{u.bio}</span>
                  </span>
                  <Button
                    variant={isFollowed ? "secondary" : "primary"}
                    size="compact"
                    onClick={() => setFollowed(toggle(followed, u.id))}
                  >
                    {isFollowed ? "Following ✓" : "Follow"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => router.push("/home")}>
            Skip for now
          </Button>
        ) : (
          <span className="text-[13px] text-fg-muted">
            {picked.length}/{MIN_GAMES} picked
          </span>
        )}
        <Button onClick={next} disabled={!canContinue}>
          {step === TOTAL_STEPS - 1 ? "Enter Nexo →" : "Continue"}
        </Button>
      </div>
    </main>
  );
}
