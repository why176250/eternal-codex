import type { Metadata } from "next";
import Link from "next/link";
import { itemSets, searchSets } from "@/lib/transmog-db";

export const metadata: Metadata = {
  title: "Transmog — Forever item sets",
  description: "Browse Forever transmog item sets by class and name, with every piece.",
  alternates: { canonical: "/transmog", languages: { en: "/transmog", "zh-Hans": "/zh/transmog", "x-default": "/transmog" } },
};

type SearchParams = Promise<{ q?: string; class?: string; page?: string }>;
const PAGE_SIZE = 36;

export default async function TransmogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const className = params.class ?? "";
  const results = searchSets(query, className);
  const page = Math.max(1, Math.min(Number(params.page) || 1, Math.ceil(results.length / PAGE_SIZE) || 1));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const classes = Array.from(new Set(itemSets.map((set) => set.class))).sort();
  function href(next: { q?: string; class?: string; page?: number }) {
    const p = new URLSearchParams();
    const values = { q: next.q ?? query, class: next.class ?? className };
    for (const [key, value] of Object.entries(values)) if (value) p.set(key, value);
    if ((next.page ?? 1) > 1) p.set("page", String(next.page));
    return p.toString() ? `/transmog?${p.toString()}` : "/transmog";
  }
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · Transmog</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Transmog sets</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Browse {itemSets.length} item sets by class and name. Open a set to see
            every piece and its item link.
          </p>
        </div>
      </section>
      <section className="container-x py-8 md:py-10">
        <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
          <input name="q" defaultValue={query} placeholder="Search sets" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
          <select name="class" defaultValue={className} className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment">
            <option value="">All classes</option>
            {classes.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
        </form>
        <p className="mt-3 text-xs text-muted">{results.length} sets</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((set) => {
            const icon = set.items[0]?.icon;
            return (
              <Link key={set.id} href={`/transmog/${set.id}`} className="panel panel-hover p-4">
                <div className="flex items-start gap-3">
                  {icon ? <img src={icon} alt="" width={40} height={40} className="size-10 rounded border border-line/80" /> : null}
                  <div className="min-w-0">
                    <h2 className="truncate text-sm capitalize text-parchment">{set.name}</h2>
                    <p className="mt-1 text-[10px] text-muted">{set.class} · {set.itemCount} pieces</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between text-xs">
          {page > 1 ? <Link href={href({ page: page - 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">← Previous</Link> : <span />}
          {page < Math.ceil(results.length / PAGE_SIZE) ? <Link href={href({ page: page + 1 })} className="rounded-lg border border-line px-3 py-2 text-muted hover:border-gold/40 hover:text-parchment">Next →</Link> : null}
        </div>
      </section>
    </main>
  );
}
