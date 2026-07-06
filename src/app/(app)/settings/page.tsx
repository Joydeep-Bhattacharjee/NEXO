"use client";

import { AnonToggle } from "@/components/shell/AnonToggle";
import { Button } from "@/components/ui/Button";
import { MY_MASKS } from "@/lib/mock-data";

const SECTION = "rounded-card border border-line bg-raised p-5";
const H2 = "text-[13px] font-semibold uppercase tracking-wide text-fg-muted";
const ROW = "flex items-center justify-between gap-3 py-2.5 text-[14px]";

/** §3.13 — Settings in spec order; Log out boxed at bottom. */
export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <section className={SECTION}>
        <h2 className={H2}>Account</h2>
        <div className={ROW}><span>Email</span><span className="text-fg-muted">s•••@gmail.com</span></div>
        <div className={ROW}><span>Handle</span><span className="font-mono text-fg-muted">@shadowstriker</span></div>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>Privacy & Security</h2>
        <div className={ROW}><span>Two-factor authentication</span><Button variant="secondary" size="compact">Enable</Button></div>
        <div className={ROW}><span>Active sessions</span><span className="text-fg-muted">2 devices</span></div>
        <div className={ROW}><span>Who can DM you</span><span className="text-fg-muted">Followed only</span></div>
        <div className={ROW}><span>Blocked users</span><span className="text-fg-muted">0</span></div>
        <div className={ROW}><span>Download / delete my data</span><Button variant="ghost" size="compact">Request</Button></div>
      </section>

      <section className={`${SECTION} border-mask/40`}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-mask">🎭 Go Anonymous</h2>
        <div className={ROW}>
          <span>Session identity</span>
          <AnonToggle />
        </div>
        <p className="pt-2 text-[12px] text-fg-muted">Your Masks (one per Realm, regenerate name once / 30 days):</p>
        <ul className="mt-2 flex flex-col gap-2">
          {MY_MASKS.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-[10px] border border-line bg-base px-3 py-2 text-[13px]">
              <span className="text-mask">{m.avatar} {m.displayName}</span>
              <span className="font-mono text-[11px] text-fg-muted">r/{m.realmSlug} · ▲{m.respect}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>Notifications</h2>
        <div className={ROW}><span>Push notifications</span><span className="text-accent">On</span></div>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>Language</h2>
        <div className="flex gap-2 pt-2">
          <Button size="compact">English</Button>
          <Button variant="secondary" size="compact">বাংলা</Button>
        </div>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>Appearance</h2>
        <div className="flex gap-2 pt-2">
          <Button size="compact">Dark</Button>
          <Button variant="secondary" size="compact">Light</Button>
          <Button variant="secondary" size="compact">AMOLED</Button>
        </div>
      </section>

      <section className={`${SECTION} border-danger/40`}>
        <Button variant="danger" className="w-full">Log out</Button>
      </section>
    </div>
  );
}
