import { BottomTabs } from "@/components/shell/BottomTabs";
import { LeftRail } from "@/components/shell/LeftRail";
import { RightRail } from "@/components/shell/RightRail";
import { TopBar } from "@/components/shell/TopBar";

/** Logged-in app shell (§3.4): top bar, 3-column desktop grid, mobile bottom tabs. */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 gap-8 px-4 pb-20 lg:px-6 lg:pb-8">
        <LeftRail />
        <main className="min-w-0 flex-1 py-6">{children}</main>
        <RightRail />
      </div>
      <BottomTabs />
    </div>
  );
}
