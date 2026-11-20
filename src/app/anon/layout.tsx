import type { Metadata } from "next";
import { ZoneShell } from "@/components/anon/ZoneShell";

export const metadata: Metadata = {
  title: "Nexo after dark",
  description: "The anonymous side of Nexo. Separate identities, separate conversations.",
};

export default function AnonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ZoneShell>{children}</ZoneShell>;
}
