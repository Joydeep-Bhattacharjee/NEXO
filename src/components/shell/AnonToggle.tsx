"use client";

import Link from "next/link";
import { VenetianMask } from "lucide-react";
import { useZoneNavigate } from "@/components/anon/ZoneTransition";

/** Go anonymous (§2.3): steps out of the main app and into the separate anonymous zone. */
export function AnonToggle() {
  const navigate = useZoneNavigate();
  return (
    <Link
      href="/anon"
      onClick={(e) => navigate(e, "/anon", "anon")}
      className="flex h-9 items-center gap-2 rounded-btn border border-mask/40 bg-mask/10 px-3 text-[13px] text-mask transition-colors duration-150 hover:bg-mask/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mask"
    >
      <VenetianMask size={16} strokeWidth={1.5} aria-hidden />
      <span className="hidden sm:inline">Go anonymous</span>
    </Link>
  );
}
