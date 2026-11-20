import { notFound } from "next/navigation";
import { ServerChat } from "@/components/servers/ServerChat";
import { SERVERS } from "@/lib/mock-data";

/** §3.6 — a server: channels, chat and members. */
export default async function ServerViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = SERVERS.find((s) => s.slug === slug);
  if (!server) notFound();
  return <ServerChat server={server} />;
}
