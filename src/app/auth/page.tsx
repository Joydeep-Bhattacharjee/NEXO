"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const MIN_PASSWORD_LENGTH = 8;
const MIN_AGE = 13;

function passwordError(pw: string): string | null {
  if (pw.length > 0 && pw.length < MIN_PASSWORD_LENGTH) {
    return `Password needs ${MIN_PASSWORD_LENGTH}+ characters`;
  }
  return null;
}

function ageError(dob: string): string | null {
  if (!dob) return null;
  const age = (Date.now() - Date.parse(dob)) / (365.25 * 24 * 3600 * 1000);
  if (age < MIN_AGE) return "You must be 13 or older to join Nexo";
  return null;
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");

  const pwErr = passwordError(password);
  const dobErr = ageError(dob);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pwErr || dobErr) return;
    router.push(tab === "signup" ? "/onboarding" : "/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-card border border-line bg-raised p-6">
        <Link href="/" className="font-display text-lg font-bold">
          nexo<span className="text-accent">.</span>
        </Link>

        {/* tabs */}
        <div role="tablist" aria-label="Auth" className="mt-5 flex rounded-btn bg-overlay p-1">
          {(["signup", "login"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`h-9 flex-1 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer ${
                tab === t ? "bg-raised text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {t === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 rounded-btn border border-transparent bg-overlay px-3 text-[15px] text-fg outline-none transition-colors focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[13px] font-medium">
            Password
            <input
              type="password"
              required
              autoComplete={tab === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(pwErr)}
              className={`h-11 rounded-btn border bg-overlay px-3 text-[15px] text-fg outline-none transition-colors focus:border-accent ${
                pwErr ? "border-danger" : "border-transparent"
              }`}
            />
            {pwErr && <span className="text-[12px] font-normal text-danger">{pwErr}</span>}
          </label>

          {tab === "signup" && (
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Date of birth
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                aria-invalid={Boolean(dobErr)}
                className={`h-11 rounded-btn border bg-overlay px-3 text-[15px] text-fg outline-none transition-colors focus:border-accent ${
                  dobErr ? "border-danger" : "border-transparent"
                }`}
              />
              {dobErr && <span className="text-[12px] font-normal text-danger">{dobErr}</span>}
            </label>
          )}

          <Button type="submit" disabled={Boolean(pwErr || dobErr)}>
            {tab === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[12px] text-fg-muted">
          <span className="h-px flex-1 bg-line" aria-hidden />
          or continue with
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" size="compact">
            Google
          </Button>
          <Button variant="secondary" className="flex-1" size="compact">
            Discord
          </Button>
        </div>

        <p className="mt-5 text-center text-[12px] text-fg-muted">
          13+ only. By joining you agree to the Terms & Community Guidelines.
        </p>
      </div>
    </main>
  );
}
