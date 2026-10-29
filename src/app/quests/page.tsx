import type { Metadata } from "next";
import Link from "next/link";
import { quests, searchQuests } from "@/lib/quests-db";

export const metadata: Metadata = {
  title: "Quests — Forever quest database",
  description: "Search Forever quests by title, giver, and zone. Includes dungeon quest chains and side quests.",
  alternates: { canonical: "/quests" },
};

type SearchParams = Promise<{ q?: string; side?: string }>;

export default async function QuestsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const side = params.side ?? "";
  const results = searchQuests(query, side);

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · Quests</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Quests</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Search {quests.length} imported quests by title, giver, or zone.
            Dungeon quest chains are included where the source records them.
          </p>
        </div>
      </section>
      <section className="container-x py-8 md:py-10">
        <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
          <input name="q" defaultValue={query} placeholder="Search quests, givers, zones" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
          <select name="side" defaultValue={side} className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment">
            <option value="">All sides</option>
            <option value="A">Alliance</option>
            <option value="H">Horde</option>
            <option value="B">Both</option>
          </select>
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
        </form>
        <p className="mt-3 text-xs text-muted">{results.length} results</p>
        <div className="panel mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-2 text-left font-normal">Quest</th>
                <th className="px-3 py-2 text-left font-normal">Level</th>
                <th className="px-3 py-2 text-left font-normal">Side</th>
                <th className="px-3 py-2 text-left font-normal">Giver</th>
                <th className="px-4 py-2 text-left font-normal">Zone</th>
              </tr>
            </thead>
            <tbody>
              {results.map((quest) => (
                <tr key={quest.id} className="border-t border-line/40">
                  <td className="px-4 py-2">
                    <span className="block text-parchment">{quest.title}</span>
                    <span className="block text-[10px] text-muted">{quest.title_zh}</span>
                  </td>
                  <td className="px-3 py-2 text-muted">{quest.level || "—"}</td>
                  <td className="px-3 py-2 text-muted">{quest.side || "—"}</td>
                  <td className="px-3 py-2 text-muted">{quest.giver_name || "—"}</td>
                  <td className="px-4 py-2 text-muted">{quest.giver_zone_zh || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/quests" className="mt-4 inline-block text-xs text-gold/80">Reset filters →</Link>
      </section>
    </main>
  );
}
