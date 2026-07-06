import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCount, STREAMS } from "@/lib/mock-data";

const FEATURES = [
  {
    title: "A feed that actually plays",
    body: "Short gameplay clips in an endless vertical feed — autoplay, react with 🔥 GG, drop takes, share the madness.",
    mock: "🎬",
    label: "Clip feed",
  },
  {
    title: "Servers for your squad",
    body: "Game-based servers with sub-servers, text channels, voice rooms and an AI assistant that summarizes what you missed.",
    mock: "🗂️",
    label: "Servers",
  },
  {
    title: "Say it as your Mask",
    body: "One persistent anonymous identity per Realm. Build reputation without revealing yourself. Flip identities with one tap.",
    mock: "🎭",
    label: "Realms — the anonymous zone",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-base/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
          <span className="font-display text-lg font-bold tracking-tight">
            nexo<span className="text-accent">.</span>
          </span>
          <div className="flex items-center gap-2">
            <Link href="/auth">
              <Button variant="ghost" size="compact">
                Log in
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="compact">Join free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* hero */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden border-b border-line"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(61,220,151,0.08),transparent_60%)]"
          />
          <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-24 text-center md:py-32">
            <h1
              id="hero-heading"
              className="font-display text-5xl font-bold leading-none tracking-tight md:text-7xl"
            >
              Play loud.
              <br />
              <span className="text-accent">Post quiet.</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] text-fg-muted">
              Clips, communities, and an anonymous zone built for gamers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/auth">
                <Button>Join free</Button>
              </Link>
              <Link href="/live">
                <Button variant="secondary">Watch live now</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* live ticker */}
        <section aria-label="Live now" className="border-b border-line bg-raised">
          <div className="mx-auto flex max-w-[1200px] items-center gap-6 overflow-x-auto px-4 py-3 rail-scroll">
            <span className="flex shrink-0 items-center gap-2 text-[13px] font-semibold text-live">
              <span className="h-2 w-2 animate-pulse rounded-full bg-live" aria-hidden />
              LIVE
            </span>
            {STREAMS.map((st) => (
              <Link
                key={st.id}
                href={`/live/${st.streamerHandle}`}
                className="flex shrink-0 items-center gap-2 text-[13px] text-fg-muted transition-colors hover:text-fg"
              >
                <span>{st.avatar}</span>
                <span className="font-medium text-fg">{st.streamer}</span>
                <span>{st.game}</span>
                <span className="font-mono text-live">{formatCount(st.viewers)} watching</span>
              </Link>
            ))}
          </div>
        </section>

        {/* feature rows */}
        <section className="mx-auto flex max-w-[1200px] flex-col gap-20 px-4 py-20">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center gap-8 md:gap-16 ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="flex-1">
                <p
                  className={`text-[13px] font-semibold uppercase tracking-widest ${
                    i === 2 ? "text-mask" : "text-accent"
                  }`}
                >
                  {f.label}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">{f.title}</h2>
                <p className="mt-3 max-w-md text-fg-muted">{f.body}</p>
              </div>
              <div
                className={`flex aspect-[4/3] w-full flex-1 items-center justify-center rounded-card border text-7xl ${
                  i === 2 ? "border-mask/40 bg-mask/10" : "border-line bg-raised"
                }`}
                aria-hidden
              >
                {f.mock}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-[13px] text-fg-muted">
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            <a href="#" className="hover:text-fg">About</a>
            <a href="#" className="hover:text-fg">Terms</a>
            <a href="#" className="hover:text-fg">Privacy</a>
            <a href="#" className="hover:text-fg">Community Guidelines</a>
          </nav>
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <button className="rounded border border-line px-2 py-0.5 text-accent cursor-pointer">EN</button>
            <button className="rounded border border-line px-2 py-0.5 hover:text-fg cursor-pointer">বাংলা</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
