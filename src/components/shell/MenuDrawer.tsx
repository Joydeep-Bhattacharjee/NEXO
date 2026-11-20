"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, Languages, LogOut, Menu, Settings, ShieldCheck, SunMoon, VenetianMask, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { CURRENT_USER } from "@/lib/mock-data";
import { useZoneNavigate } from "@/components/anon/ZoneTransition";


const ROW =
  "flex h-12 items-center gap-3 rounded-btn px-3 text-[14px] text-fg transition-colors hover:bg-overlay focus-visible:outline-2 focus-visible:outline-accent";

/** The ☰ menu: settings shortcuts, with the way into the anonymous zone at the top of the list. */
export function MenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigate = useZoneNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="main-menu"
        className="flex h-9 w-9 items-center justify-center rounded-btn text-fg-muted transition-colors hover:bg-overlay hover:text-fg cursor-pointer"
      >
        <Menu size={20} strokeWidth={1.5} aria-hidden />
      </button>

      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        id="main-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-[320px] max-w-[88vw] flex-col border-l border-line bg-raised transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <h2 className="text-[15px] font-medium">Settings</h2>
          <button
            onClick={close}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-btn text-fg-muted transition-colors hover:bg-overlay hover:text-fg cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Settings">
          <Link href={`/u/${CURRENT_USER.handle}`} onClick={close} className={`${ROW} h-14`}>
            <Avatar name={CURRENT_USER.displayName} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{CURRENT_USER.displayName}</span>
              <span className="block truncate text-[12px] text-fg-muted">View profile</span>
            </span>
          </Link>
          <span className="mx-3 my-1 h-px bg-line" aria-hidden />
          <Link href="/settings" onClick={close} className={ROW}>
            <ShieldCheck size={18} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
            <span className="flex-1">Privacy and security</span>
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
          </Link>

          <Link
            href="/anon"
            onClick={(e) => {
              close();
              navigate(e, "/anon", "anon");
            }}
            className="group my-1 flex items-center gap-3 rounded-btn border border-[var(--anon-card-border)] bg-[var(--anon-card-bg)] px-3 py-3 transition-colors hover:border-[var(--anon-card-hover)] focus-visible:outline-2 focus-visible:outline-mask"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--anon-icon-bg)] text-[var(--anon-icon)]">
              <VenetianMask size={18} strokeWidth={1.5} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium text-[var(--anon-card-text)]">Go anonymous</span>
              <span className="block text-[12px] text-[var(--anon-card-muted)]">Realms, under an identity you make up</span>
            </span>
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden className="text-[var(--anon-card-muted)] transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>

          <div className={`${ROW} hover:bg-transparent`}>
            <Languages size={18} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
            <span className="flex-1">Language</span>
            <LanguageSwitch size="md" />
          </div>

          <div className={`${ROW} hover:bg-transparent`}>
            <SunMoon size={18} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
            <span className="flex-1">Appearance</span>
            <ThemeSwitch />
          </div>

          <Link href="/settings" onClick={close} className={ROW}>
            <Settings size={18} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
            <span className="flex-1">All settings</span>
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden className="text-fg-muted" />
          </Link>
        </nav>

        <div className="border-t border-line p-3">
          <button
            onClick={() => {
              close();
              router.push("/");
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-btn border border-danger/40 text-[14px] font-medium text-danger transition-colors hover:bg-danger/10 cursor-pointer"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
