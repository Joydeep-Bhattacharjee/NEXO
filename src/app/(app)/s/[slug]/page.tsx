import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount, MESSAGES, SERVERS, USERS } from "@/lib/mock-data";

const CHANNEL_ICONS: Record<string, string> = {
  announcement: "📢",
  featured: "⭐",
  text: "💬",
  voice: "🎙",
  clips: "🎬",
};

/** §3.6 — channel list, message stream, composer, member list. */
export default async function ServerViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const server = SERVERS.find((s) => s.slug === slug);
  if (!server) notFound();

  return (
    <div className="flex h-[calc(100vh-8.5rem)] gap-4">
      {/* channels */}
      <aside className="hidden w-52 shrink-0 flex-col rounded-card border border-line bg-raised p-3 md:flex">
        <h1 className="flex items-center gap-2 px-1 pb-3 font-display text-[15px] font-bold">
          <span>{server.icon}</span>
          <span className="truncate">{server.name}</span>
        </h1>
        <ul className="flex flex-col gap-0.5">
          {server.channels.map((c, i) => (
            <li key={c.id}>
              <Link
                href={`/s/${server.slug}`}
                aria-current={i === 2 ? "page" : undefined}
                className={`flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-[13px] transition-colors ${
                  i === 2 ? "bg-overlay text-fg" : "text-fg-muted hover:bg-overlay hover:text-fg"
                }`}
              >
                <span aria-hidden>{CHANNEL_ICONS[c.type]}</span>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* messages */}
      <section className="flex min-w-0 flex-1 flex-col rounded-card border border-line bg-raised">
        <header className="flex h-12 items-center gap-2 border-b border-line px-4 text-[14px] font-semibold">
          💬 general
          <span className="font-mono text-[11px] font-normal text-fg-muted">
            {formatCount(server.online)} online
          </span>
        </header>
        <ul className="rail-scroll flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {MESSAGES.map((m) => (
            <li key={m.id} className={`flex gap-3 ${m.isAI ? "rounded-card border border-accent/30 bg-accent/5 p-3" : ""}`}>
              <Avatar emoji={m.avatar} size={36} label={m.author} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-[14px] font-semibold ${m.isAI ? "text-accent" : ""}`}>
                    {m.author}
                    {m.isAI && <span className="ml-1.5 rounded bg-accent/15 px-1 text-[10px] font-bold uppercase">AI</span>}
                  </span>
                  <time className="font-mono text-[11px] text-fg-muted">{m.time}</time>
                </div>
                {m.isVoiceNote ? (
                  <button className="mt-1 flex h-10 w-56 items-center gap-2 rounded-full bg-overlay px-3 text-[13px] text-fg-muted cursor-pointer hover:text-fg">
                    ▶ <span className="flex-1 border-t border-dashed border-line" aria-hidden /> 0:23 🎙
                  </button>
                ) : (
                  <p className="text-[14px] leading-[21px]">{m.body}</p>
                )}
                {m.reactions && (
                  <div className="mt-1.5 flex gap-1.5">
                    {m.reactions.map((r) => (
                      <span key={r} className="rounded-full border border-line bg-overlay px-2 py-0.5 text-[12px]">
                        {r} 1
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        {/* composer */}
        <footer className="flex items-center gap-2 border-t border-line p-3">
          <button aria-label="Attach clip" className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-overlay cursor-pointer">📎</button>
          <input
            placeholder="Write text… (@Adda for AI)"
            className="h-10 min-w-0 flex-1 rounded-btn border border-transparent bg-overlay px-3 text-[14px] outline-none transition-colors focus:border-accent"
          />
          <button aria-label="Hold to record voice note" className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-overlay cursor-pointer">🎙</button>
        </footer>
      </section>

      {/* members */}
      <aside className="hidden w-48 shrink-0 rounded-card border border-line bg-raised p-3 xl:block">
        <h2 className="px-1 pb-2 text-[12px] font-semibold uppercase tracking-wide text-fg-muted">
          Members
        </h2>
        <ul className="flex flex-col gap-1">
          {USERS.map((u) => (
            <li key={u.id} className="flex items-center gap-2 rounded-[8px] px-1.5 py-1">
              <Avatar emoji={u.avatar} size={28} isLive={u.isLive} label={u.displayName} />
              <span className="truncate text-[13px]">{u.displayName}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
