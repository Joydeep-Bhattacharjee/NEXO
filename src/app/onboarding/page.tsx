"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatCount, SERVERS, USERS } from "@/lib/mock-data";
import { ServerMark } from "@/components/ui/ServerMark";
import { PhotoPicker } from "@/components/profile/PhotoPicker";
import { useAppHydration, useAppStore } from "@/lib/app-store";

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const isReady = useAppHydration();
  const hasPhoto = useAppStore((st) => isReady && Boolean(st.myPhoto));
  const [step, setStep] = useState(0);
  const [joined, setJoined] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);


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
            className={`h-2 rounded-full transition-colors duration-200 ${
              i === step ? "w-6 bg-fg" : "w-2 bg-overlay"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <section className="mt-8 flex flex-col items-center text-center">
          <h1 className="font-display text-[36px] font-bold leading-tight">Add a profile photo</h1>
          <p className="mt-1 max-w-sm text-fg-muted">
            People see this next to your clips and messages. Without one your profile stays a blank white circle
          </p>
          <div className="mt-8">
            <PhotoPicker size={128} />
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-8">
          <h1 className="font-display text-[36px] font-bold leading-tight">Join your first servers</h1>
          <p className="mt-1 text-fg-muted">Popular with players near you</p>
          <ul className="mt-6 flex flex-col gap-3">
            {SERVERS.filter((s) => !s.parentSlug).slice(0, 5).map((s) => {
              const isJoined = joined.includes(s.id);
              return (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-card border border-line bg-raised p-4"
                >
                  <ServerMark name={s.name} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{s.name}</span>
                    <span className="block font-mono text-[12px] text-fg-muted">
                      {formatCount(s.members)} members · {formatCount(s.online)} online
                    </span>
                  </span>
                  <Button
                    variant={isJoined ? "secondary" : "primary"}
                    size="compact"
                    onClick={() => setJoined(toggle(joined, s.id))}
                  >
                    {isJoined ? "Joined" : "Join"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {step === 2 && (
        <section className="mt-8">
          <h1 className="font-display text-[36px] font-bold leading-tight">Follow some creators</h1>
          <p className="mt-1 text-fg-muted">Their clips and streams fill your first feed</p>
          <ul className="mt-6 flex flex-col gap-3">
            {USERS.slice(1).map((u) => {
              const isFollowed = followed.includes(u.id);
              return (
                <li
                  key={u.id}
                  className="flex items-center gap-3 rounded-card border border-line bg-raised p-4"
                >
                  <Avatar size={44} isLive={u.isLive} name={u.displayName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{u.displayName}</span>
                    <span className="block truncate text-[12px] text-fg-muted">{u.bio}</span>
                  </span>
                  <Button
                    variant={isFollowed ? "secondary" : "primary"}
                    size="compact"
                    onClick={() => setFollowed(toggle(followed, u.id))}
                  >
                    {isFollowed ? "Following" : "Follow"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/home")}>
          Skip for now
        </Button>
        <Button onClick={next} disabled={step === 0 && !hasPhoto}>
          {step === TOTAL_STEPS - 1 ? "Enter Nexo" : "Continue"}
        </Button>
      </div>
    </main>
  );
}
