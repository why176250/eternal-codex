import type { Metadata } from "next";
import Link from "next/link";
import { dbItems, itemClasses, itemSlots, searchItems } from "@/lib/items-db";

export const metadata: Metadata = {
  title: "Items — Forever item database",
  description:
    "Search World of Warcraft: Forever items by name, type, and slot. Browse 23,000+ items with quality, item level, and source details.",
  alternates: { canonical: "/items" },
};

const PAGE_SIZE = 48;
type SearchParams = Promise<{ q?: string; class?: string; slot?: string; page?: string }>;
const qualityColor: Record<string, string> = {
  Poor: "#9d9d9d", Common: "#ffffff", Uncommon: "#1eff00", Rare: "#0070dd", Epic: "#a335ee", Legendary: "#ff8000",
};

export default async function ItemsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const className = params.class ?? "";
  const slot = params.slot ?? "";
  const results = searchItems(query, className, slot);
  const page = Math.max(1, Math.min(Number(params.page) || 1, Math.ceil(results.length / PAGE_SIZE) || 1));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function href(next: { q?: string; class?: string; slot?: string; page?: number }) {
    const p = new URLSearchParams();
    const values = { q: next.q ?? query, class: next.class ?? className, slot: next.slot ?? slot };
    for (const [key, value] of Object.entries(values)) if (value) p.set(key, value);
    if ((next.page ?? 1) > 1) p.set("page", String(next.page));
    return p.toString() ? `/items?${p.toString()}` : "/items";
  }

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · Items</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Item database</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Search {dbItems.length.toLocaleString("en-US")} Forever items by name,
            type, and slot. Names, quality, and item level are imported from the
            Official game data and Wowhead.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">{dbItems.length.toLocaleString("en-US")} items</span>
            <span className="rounded-full border border-line/80 px-3 py-1">Official data, Wowhead</span>
          </div>
        </div>
      </section>

      <section className="container-x py-8 md:py-10">
        <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search items"
            className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
          />
          <select name="class" defaultValue={className} className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment">
            <option value="">All types</option>
            {itemClasses.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select name="slot" defaultValue={slot} className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment">
            <option value="">All slots</option>
            {itemSlots.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
        </form>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
          <span>{results.length.toLocaleString("en-US")} results</span>
          <span>Page {page} / {Math.max(1, Math.ceil(results.length / PAGE_SIZE))}</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="panel panel-hover flex items-start gap-3 p-3">
              <img src={item.icon} alt="" width={40} height={40} className="size-10 shrink-0 rounded border border-line/80" loading="lazy" />
              <span className="min-w-0">
                <span className="block truncate text-sm" style={{ color: qualityColor[item.qualityLabel] ?? "#ede7d7" }}>{item.name}</span>
                <span className="mt-1 block text-[10px] text-muted">{item.qualityLabel} · iLvl {item.ilvl} · {item.slotName}</span>
                <span className="mt-0.5 block text-[10px] text-muted/70">{item.className}</span>
              </span>
            </Link>
          ))}
        </div>

        {visible.length === 0 ? <p className="panel mt-4 p-6 text-sm text-muted">No items match that search.</p> : null}

        <div className="mt-6 flex items-center justify-between gap-3 text-xs">
          {page > 1 ? <Link href={href({ page: page - 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">← Previous</Link> : <span />}
          {page < Math.ceil(results.length / PAGE_SIZE) ? <Link href={href({ page: page + 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">Next →</Link> : null}
        </div>
      </section>
    </main>
  );
}
