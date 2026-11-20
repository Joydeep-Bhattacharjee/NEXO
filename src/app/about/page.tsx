import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Nexo" };

const SECTIONS = [
  {
    id: "about",
    title: "About us",
    body: "Nexo is a home for gamers in Bangladesh: clips, game servers and Realms, an anonymous side where you talk under identities you make up.",
  },
  {
    id: "terms",
    title: "Terms",
    body: "You must be 13 or older. You own what you post and give Nexo permission to show it. Don't post anything you don't have the right to share.",
  },
  {
    id: "privacy",
    title: "Privacy",
    body: "Anonymous identities are never linked to your main profile in anything other people can see. You can download or delete your data from Settings.",
  },
  {
    id: "guidelines",
    title: "Community guidelines",
    body: "No harassment, hate or cheating services. Moderators can ban a Mask without ever seeing whose account it is. Report anything that breaks these rules.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-16">
      <Link href="/home" className="font-display text-[26px] font-bold">
        nexo<span className="text-accent">.</span>
      </Link>
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-8">
          <h2 className="font-display text-[30px] font-bold">{s.title}</h2>
          <p className="mt-3 text-[15px] leading-6 text-fg-muted">{s.body}</p>
        </section>
      ))}
    </main>
  );
}
