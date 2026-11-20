"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, VenetianMask } from "lucide-react";
import { AnonToggle } from "@/components/shell/AnonToggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { useAppHydration, useAppStore, type Language, type Theme } from "@/lib/app-store";
import { CURRENT_USER } from "@/lib/mock-data";

const SECTION = "rounded-card border border-line bg-raised p-5";
const H2 = "text-[14px] font-medium";
const ROW = "flex items-center justify-between gap-3 py-2.5 text-[14px]";
const LANGUAGES: Language[] = ["EN", "বাংলা"];
const THEMES: { key: Theme; label: string }[] = [
  { key: "dark", label: "Dark" },
  { key: "light", label: "Light" },
  { key: "amoled", label: "AMOLED" },
];

function Switch({ isOn, onChange, label }: { isOn: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={() => onChange(!isOn)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${isOn ? "bg-accent" : "bg-overlay"}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Segmented<T extends string>({ options, value, onChange }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-btn bg-overlay p-1" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.key}
          role="radio"
          aria-checked={value === o.key}
          onClick={() => onChange(o.key)}
          className={`h-8 flex-1 rounded-[8px] px-3 text-[13px] transition-colors cursor-pointer ${
            value === o.key ? "bg-raised text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" : "text-fg-muted hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** §3.13 — Settings. Every control here takes effect immediately. */
export default function SettingsPage() {
  const router = useRouter();
  const toast = useToast((s) => s.show);
  const isReady = useAppHydration();
  const { theme, language, twoFactor, push, setTheme, setLanguage, setTwoFactor, setPush } = useAppStore();
  const [hasRequestedData, setHasRequestedData] = useState(false);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4" aria-busy={!isReady}>
      <h1 className="font-display text-[36px] font-bold leading-tight">Settings</h1>

      <section className={SECTION}>
        <h2 className={H2}>Account</h2>
        <div className={ROW}><span>Email</span><span className="text-fg-muted">s•••@gmail.com</span></div>
        <div className={ROW}><span>Handle</span><span className="font-mono text-fg-muted">@{CURRENT_USER.handle}</span></div>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>Privacy and security</h2>
        <div className={ROW}>
          <span>Two-factor authentication</span>
          <Switch
            isOn={twoFactor}
            label="Two-factor authentication"
            onChange={(on) => {
              setTwoFactor(on);
              toast(on ? "Two-factor is on. You'll confirm new logins with a code" : "Two-factor is off");
            }}
          />
        </div>
        <div className={ROW}><span>Active sessions</span><span className="text-fg-muted">2 devices</span></div>
        <div className={ROW}><span>Who can DM you</span><span className="text-fg-muted">Friends only</span></div>
        <div className={ROW}><span>Blocked users</span><span className="text-fg-muted">0</span></div>
        <div className={ROW}>
          <span>Download or delete my data</span>
          <Button
            variant="ghost"
            size="compact"
            disabled={hasRequestedData}
            onClick={() => {
              setHasRequestedData(true);
              toast("Request received. We'll email a download link within 48 hours");
            }}
          >
            {hasRequestedData ? "Requested" : "Request"}
          </Button>
        </div>
      </section>

      <section className={SECTION}>
        <h2 className="flex items-center gap-2 text-[14px] font-medium">
          <VenetianMask size={16} strokeWidth={1.5} aria-hidden />
          Anonymous zone
        </h2>
        <div className={ROW}>
          <span className="text-fg-muted">Identities live inside the zone, not on this account</span>
          <AnonToggle />
        </div>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>Notifications</h2>
        <div className={ROW}>
          <span>Push notifications</span>
          <Switch isOn={push} label="Push notifications" onChange={setPush} />
        </div>
      </section>

      <section className={SECTION}>
        <h2 className={`${H2} pb-3`}>Language</h2>
        <Segmented options={LANGUAGES.map((l) => ({ key: l, label: l === "EN" ? "English" : l }))} value={language} onChange={setLanguage} />
      </section>

      <section className={SECTION}>
        <h2 className={`${H2} pb-3`}>Appearance</h2>
        <Segmented options={THEMES} value={theme} onChange={setTheme} />
      </section>

      <Button variant="danger" className="w-full" onClick={() => router.push("/")}>
        <LogOut size={16} strokeWidth={1.5} aria-hidden />
        Log out
      </Button>
    </div>
  );
}
