import type { Metadata } from "next";
import Link from "next/link";
import updates from "@/data/site-updates.json";

export const metadata: Metadata = {
  title: "Patch notes — Forever and Eversixty updates",
  description: "Eversixty release notes and links to Forever patch notes.",
  alternates: { canonical: "/patch-notes" },
};

export default function PatchNotesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Patch notes</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Patch notes & site updates</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Release notes for Eversixty itself. Game patch notes are published by
            the Forever team; this page tracks what changed here.
          </p>
        </div>
      </section>
      <section className="container-x max-w-3xl py-10">
        <div className="space-y-4">
          {(updates as { date: string; title: string; items: string[] }[]).map((update) => (
            <article key={`${update.date}-${update.title}`} className="panel p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="display text-xl text-parchment">{update.title}</h2>
                <span className="text-[11px] text-muted">{update.date}</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted">
                {update.items.map((item) => <li key={item}>· {item}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <Link href="/data" className="mt-6 inline-block text-sm text-gold/90 hover:text-gold-soft">Browse the database →</Link>
      </section>
    </main>
  );
}
