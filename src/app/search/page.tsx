import type { Metadata } from "next";
import Link from "next/link";
import { dbItems } from "@/lib/items-db";
import { dbSpells } from "@/lib/spells-db";
import { itemSets } from "@/lib/transmog-db";
import { npcs } from "@/lib/npcs-db";

export const metadata: Metadata = {
  title: "Search — items, spells, sets, NPCs",
  description: "Search the Eversixty database across items, spells, transmog sets, and NPCs.",
  alternates: { canonical: "/search" },
};

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const q = query.toLowerCase();
  const items = query ? dbItems.filter((item) => `${item.name} ${item.className}`.toLowerCase().includes(q)).slice(0, 10) : [];
  const spells = query ? dbSpells.filter((spell) => `${spell.name} ${spell.school}`.toLowerCase().includes(q)).slice(0, 10) : [];
  const sets = query ? itemSets.filter((set) => `${set.name} ${set.class}`.toLowerCase().includes(q)).slice(0, 10) : [];
  const people = query ? npcs.filter((npc) => `${npc.name} ${npc.type} ${npc.rank}`.toLowerCase().includes(q)).slice(0, 10) : [];
  const total = items.length + spells.length + sets.length + people.length;

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Search</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Search the database</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            33,000+ entries across items, spells, sets, NPCs, and the world.
          </p>
          <form method="get" className="mt-6 flex max-w-3xl flex-wrap gap-2">
            <input
              name="q"
              defaultValue={query}
              autoFocus
              placeholder="Search 33,000+ entries — items, spells, sets, NPCs…"
              className="min-w-64 flex-1 rounded-lg border border-line bg-deep px-4 py-3 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
            />
            <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-5 py-3 text-sm text-gold-soft">Search</button>
          </form>
        </div>
      </section>
      <section className="container-x max-w-4xl py-8">
        {query ? <p className="text-xs text-muted">{total} results for “{query}”</p> : <p className="text-sm text-muted">Start typing to search the database.</p>}
        <div className="mt-5 space-y-6">
          {items.length > 0 ? <ResultGroup title="Items" items={items.map((item) => ({ key: item.id, label: item.name, href: `/items/${item.id}`, meta: `${item.qualityLabel} · iLvl ${item.ilvl}` }))} /> : null}
          {spells.length > 0 ? <ResultGroup title="Spells" items={spells.map((spell) => ({ key: spell.id, label: spell.name, href: `/spells/${spell.id}`, meta: spell.school }))} /> : null}
          {sets.length > 0 ? <ResultGroup title="Sets" items={sets.map((set) => ({ key: set.id, label: set.name, href: `/transmog/${set.id}`, meta: set.class }))} /> : null}
          {people.length > 0 ? <ResultGroup title="NPCs" items={people.map((npc) => ({ key: npc.id, label: npc.name, href: `/npcs?q=${encodeURIComponent(npc.name)}`, meta: npc.type }))} /> : null}
        </div>
      </section>
    </main>
  );
}

function ResultGroup({ title, items }: { title: string; items: { key: number; label: string; href: string; meta: string }[] }) {
  return (
    <div>
      <h2 className="display text-lg text-parchment">{title}</h2>
      <div className="mt-2 divide-y divide-line/50 rounded-lg border border-line/70">
        {items.map((item) => (
          <Link key={item.key} href={item.href} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.03]">
            <span className="truncate text-parchment">{item.label}</span>
            <span className="shrink-0 text-[10px] text-muted">{item.meta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
