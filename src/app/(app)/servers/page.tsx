import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCount, SERVERS, type Server } from "@/lib/mock-data";

function ServerRow({ server, indent = false }: { server: Server; indent?: boolean }) {
  return (
    <li className={indent ? "ml-10" : ""}>
      <div className="flex items-center gap-3 rounded-card border border-line bg-raised p-4 transition-colors hover:border-line-hover">
        <Link
          href={`/s/${server.slug}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-overlay text-xl">
            {server.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{server.name}</span>
            <span className="flex items-center gap-2 font-mono text-[12px] text-fg-muted">
              {formatCount(server.members)} members
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {formatCount(server.online)}
              </span>
            </span>
          </span>
        </Link>
        <Button variant={server.joined ? "secondary" : "primary"} size="compact">
          {server.joined ? "Open" : "Join"}
        </Button>
      </div>
    </li>
  );
}

/** §3.5 — My Servers + Popular; sub-servers indented under parents. */
export default function ServersPage() {
  const parents = SERVERS.filter((s) => !s.parentSlug);
  const childrenOf = (slug: string) => SERVERS.filter((s) => s.parentSlug === slug);
  const mine = parents.filter((s) => s.joined);
  const popular = parents.filter((s) => !s.joined);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="font-display text-2xl font-bold">My Servers</h1>
        <ul className="mt-4 flex flex-col gap-3">
          {mine.map((s) => (
            <Fragment key={s.id}>
              <ServerRow server={s} />
              {childrenOf(s.slug).map((c) => (
                <ServerRow key={c.id} server={c} indent />
              ))}
            </Fragment>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Popular</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {popular.map((s) => (
            <ServerRow key={s.id} server={s} />
          ))}
        </ul>
      </section>
    </div>
  );
}
