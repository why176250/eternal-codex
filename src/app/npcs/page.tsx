import type { Metadata } from "next";
import Link from "next/link";
import { npcs, searchNpcs } from "@/lib/npcs-db";

export const metadata: Metadata = {
  title: "NPCs — Forever NPC database",
  description: "Search 6,220 Forever NPCs by name, type, rank, and level.",
  alternates: { canonical: "/npcs" },
};

type SearchParams = Promise<{ q?: string }>;

export default async function NpcsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const results = searchNpcs(query).slice(0, 200);
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · NPCs</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">NPC database</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Search {npcs.length.toLocaleString("en-US")} NPCs by name, type, and rank.
          </p>
        </div>
      </section>
      <section className="container-x py-8 md:py-10">
        <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
          <input name="q" defaultValue={query} placeholder="Search NPCs" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
        </form>
        <p className="mt-3 text-xs text-muted">{results.length} results{results.length === 200 ? " (first 200)" : ""}</p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted"><tr><th className="px-4 py-2 text-left font-normal">NPC</th><th className="px-3 py-2 text-left font-normal">Level</th><th className="px-3 py-2 text-left font-normal">Rank</th><th className="px-4 py-2 text-left font-normal">Type</th></tr></thead>
            <tbody>{results.map((npc) => <tr key={npc.id} className="border-t border-line/40"><td className="px-4 py-2 text-parchment">{npc.name}</td><td className="px-3 py-2 text-muted">{npc.level || "—"}</td><td className="px-3 py-2 text-muted">{npc.rank || "—"}</td><td className="px-4 py-2 text-muted">{npc.type || "—"}</td></tr>)}</tbody>
          </table>
        </div>
        <Link href="/npcs" className="mt-4 inline-block text-xs text-gold/80">Reset search →</Link>
      </section>
    </main>
  );
}
