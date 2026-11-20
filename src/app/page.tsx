import Link from "next/link";
import {
  ClipsPreview,
  HeroPreview,
  RealmPreview,
  ServerPreview,
} from "@/components/landing/Previews";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { formatCount, STREAMS } from "@/lib/mock-data";

const FEATURES = [
  {
    label: "Clip feed",
    title: "A feed that actually plays",
    body: "Short gameplay clips that autoplay as you scroll. React GG, drop your take, send the madness to your squad.",
    preview: ClipsPreview,
    isMask: false,
  },
  {
    label: "Servers",
    title: "A server for every squad",
    body: "Game servers with sub-servers, text channels and voice rooms. Ask Adda and it sums up what you missed while you slept.",
    preview: ServerPreview,
    isMask: false,
  },
  {
    label: "Realms",
    title: "Say it as your Mask",
    body: "Step into a separate side of Nexo with an identity you make up. Keep a few if you like. Nobody can trace them to your main or to each other.",
    preview: RealmPreview,
    isMask: true,
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-base/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 lg:px-6">
          <span className="font-display text-[24px] font-bold leading-none">
            nexo<span className="text-accent">.</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-[14px] text-fg-muted transition-colors hover:text-fg">
              Log in
            </Link>
            <Link href="/auth">
              <Button size="compact">Join free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section aria-labelledby="hero-heading" className="overflow-hidden border-b border-line">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-6">
            <div className="card-rise">
              <h1
                id="hero-heading"
                className="font-display text-[72px] font-extrabold leading-[0.92] md:text-[128px]"
              >
                Play loud.
                <br />
                Post quiet.
              </h1>
              <p className="mt-6 max-w-[34rem] text-[18px] leading-7 text-fg-muted">
                Share your clips, run your squad&apos;s server and say what you really think as your
                Mask. Built for gamers in Bangladesh, in English and বাংলা.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/auth">
                  <Button>Join free</Button>
                </Link>
                <Link href="/live">
                  <Button variant="secondary">Watch who&apos;s live</Button>
                </Link>
              </div>
            </div>
            <div className="card-rise [animation-delay:80ms]">
              <HeroPreview />
            </div>
          </div>
        </section>

        <section aria-label="Live now" className="border-b border-line bg-raised">
          <div className="rail-scroll mx-auto flex max-w-[1200px] items-center gap-8 overflow-x-auto px-4 py-3 lg:px-6">
            <span className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-live">
              <span className="h-2 w-2 rounded-full bg-live" aria-hidden />
              Live now
            </span>
            {STREAMS.map((st) => (
              <Link
                key={st.id}
                href={`/live/${st.streamerHandle}`}
                className="flex shrink-0 items-center gap-2.5 text-[13px] text-fg-muted transition-colors hover:text-fg"
              >
                <Avatar name={st.streamer} size={24} />
                <span className="text-fg">{st.streamer}</span>
                <span>{st.game}</span>
                <span className="font-mono text-[12px]">{formatCount(st.viewers)} watching</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto flex max-w-[1200px] flex-col gap-24 px-4 py-24 lg:gap-32 lg:px-6 lg:py-32">
          {FEATURES.map((f, i) => {
            const Preview = f.preview;
            return (
              <div
                key={f.title}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className={`text-[14px] ${f.isMask ? "text-mask" : "text-fg-muted"}`}>{f.label}</p>
                  <h2 className="mt-2 font-display text-[44px] font-bold leading-[0.95] md:text-[60px]">
                    {f.title}
                  </h2>
                  <p className="mt-4 max-w-md text-[16px] leading-6 text-fg-muted">{f.body}</p>
                </div>
                <Preview />
              </div>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-[13px] text-fg-muted lg:px-6">
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
            <Link href="/about#about" className="transition-colors hover:text-fg">About</Link>
            <Link href="/about#terms" className="transition-colors hover:text-fg">Terms</Link>
            <Link href="/about#privacy" className="transition-colors hover:text-fg">Privacy</Link>
            <Link href="/about#guidelines" className="transition-colors hover:text-fg">Community guidelines</Link>
          </nav>
          <LanguageSwitch />
        </div>
      </footer>
    </div>
  );
}
