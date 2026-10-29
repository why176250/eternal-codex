import type { Metadata } from "next";
import Link from "next/link";
import { dbSpells, searchSpells } from "@/lib/spells-db";

export const metadata: Metadata = {
  title: "Spells — Forever spellbook",
  description:
    "Search World of Warcraft: Forever spells and abilities by name and school. Browse the global spell index.",
  alternates: { canonical: "/spells" },
};

const PAGE_SIZE = 60;
type SearchParams = Promise<{ q?: string; school?: string; page?: string }>;
const schoolEnglish: Record<string, string> = {
  自然: "Nature", 火焰: "Fire", 冰霜: "Frost", 暗影: "Shadow", 神圣: "Holy",
  奥术: "Arcane", 物理: "Physical", 冰霜暗影: "Frost / Shadow", 自然神圣: "Nature / Holy",
};

export default async function SpellsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const school = params.school ?? "";
  const results = searchSpells(query, school);
  const page = Math.max(1, Math.min(Number(params.page) || 1, Math.ceil(results.length / PAGE_SIZE) || 1));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const schools = Array.from(new Set(dbSpells.map((spell) => spell.school).filter(Boolean))).sort();

  function href(next: { q?: string; school?: string; page?: number }) {
    const p = new URLSearchParams();
    const values = { q: next.q ?? query, school: next.school ?? school };
    for (const [key, value] of Object.entries(values)) if (value) p.set(key, value);
    if ((next.page ?? 1) > 1) p.set("page", String(next.page));
    return p.toString() ? `/spells?${p.toString()}` : "/spells";
  }

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · Spells</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Spellbook</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Search {dbSpells.length.toLocaleString("en-US")} spells and abilities
            from the Forever client by name and school.
          </p>
        </div>
      </section>
      <section className="container-x py-8 md:py-10">
        <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
          <input name="q" defaultValue={query} placeholder="Search spells" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
          <select name="school" defaultValue={school} className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment">
            <option value="">All schools</option>
            {schools.map((value) => <option key={value} value={value}>{schoolEnglish[value] ?? value}</option>)}
          </select>
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
        </form>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
          <span>{results.length.toLocaleString("en-US")} results</span>
          <span>Page {page} / {Math.max(1, Math.ceil(results.length / PAGE_SIZE))}</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((spell) => (
            <Link key={spell.id} href={`/spells/${spell.id}`} className="panel panel-hover flex items-start gap-3 p-3">
              <img src={spell.icon} alt="" width={40} height={40} className="size-10 shrink-0 rounded border border-line/80" loading="lazy" />
              <span className="min-w-0">
                <span className="block truncate text-sm text-parchment">{spell.name}</span>
                <span className="mt-1 block text-[10px] text-muted">{schoolEnglish[spell.school] ?? spell.school}</span>
              </span>
            </Link>
          ))}
        </div>
        {visible.length === 0 ? <p className="panel mt-4 p-6 text-sm text-muted">No spells match that search.</p> : null}
        <div className="mt-6 flex items-center justify-between gap-3 text-xs">
          {page > 1 ? <Link href={href({ page: page - 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">← Previous</Link> : <span />}
          {page < Math.ceil(results.length / PAGE_SIZE) ? <Link href={href({ page: page + 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">Next →</Link> : null}
        </div>
      </section>
    </main>
  );
}
