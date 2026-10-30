import type { Metadata } from "next";
import Link from "next/link";
import { itemCounts, itemQualityColors, itemQualityLabels, itemSlots, itemStatusLabels, itemTypes, wclItems, type WclItem } from "@/lib/wcl-items";

export const metadata: Metadata = {
  title: "Item database — WoW Forever",
  description: "Every WoW Forever beta item compared with Classic: new, changed, unchanged, and absent items.",
  alternates: { canonical: "/search" },
};

type SearchParams = Promise<{ q?: string; status?: string; quality?: string; slot?: string; type?: string; page?: string }>;

const PAGE_SIZE = 100;

function iconUrl(item: WclItem) {
  return `https://wowforever.wclbox.com/tubiao/${item.k}.jpg`;
}

function statusLabel(status: string) {
  return status === "new" ? "Added" : status === "changed" ? "Changed" : status === "same" ? "Unchanged" : "Not in Forever";
}

export default async function ItemDatabasePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const status = ["new", "changed", "same", "missing"].includes(params.status ?? "") ? params.status! : "all";
  const quality = /^[0-6]$/.test(params.quality ?? "") ? Number(params.quality) : "all";
  const slot = params.slot ?? "all";
  const itemType = params.type ?? "all";
  const page = Math.max(1, Number(params.page) || 1);
  const q = query.toLowerCase();

  const filtered = wclItems.filter((item) =>
    (!q || `${item.n} ${item.c} ${item.s}`.toLowerCase().includes(q)) &&
    (status === "all" || item.st === status) &&
    (quality === "all" || item.q === quality) &&
    (slot === "all" || item.s === slot) &&
    (itemType === "all" || item.c === itemType),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function href(next: Record<string, string | number | undefined>) {
    const values: Record<string, string> = {};
    if (query) values.q = query;
    if (status !== "all") values.status = status;
    if (quality !== "all") values.quality = String(quality);
    if (slot !== "all") values.slot = slot;
    if (itemType !== "all") values.type = itemType;
    if (currentPage > 1) values.page = String(currentPage);
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined || value === "" || value === "all") delete values[key];
      else values[key] = String(value);
    }
    const qs = new URLSearchParams(values).toString();
    return qs ? `/search?${qs}` : "/search";
  }

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-9 md:py-12">
          <p className="eyebrow">Items · Equipment · Sets</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="display text-3xl text-parchment md:text-5xl">Item database</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Every beta client item compared with Classic: additions, changes and removals at a glance.</p></div><span className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] uppercase tracking-wider text-gold-soft">Forever build 1.60.1.70685</span></div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="panel p-3"><p className="text-[10px] uppercase tracking-wider text-muted">All items</p><p className="mt-1 text-2xl text-parchment">{itemCounts.total.toLocaleString()}</p></div>
            <div className="panel p-3"><p className="text-[10px] uppercase tracking-wider text-muted">New in Forever</p><p className="mt-1 text-2xl text-[#6fcf97]">{itemCounts.new.toLocaleString()}</p></div>
            <div className="panel p-3"><p className="text-[10px] uppercase tracking-wider text-muted">Changed</p><p className="mt-1 text-2xl text-gold-soft">{itemCounts.changed.toLocaleString()}</p></div>
            <div className="panel p-3"><p className="text-[10px] uppercase tracking-wider text-muted">Not in Forever</p><p className="mt-1 text-2xl text-[#ff6b6b]">{itemCounts.missing.toLocaleString()}</p></div>
          </div>
        </div>
      </section>
      <section className="container-x py-7">
        <form method="get" className="panel flex flex-wrap items-end gap-2 p-3">
          <label className="min-w-56 flex-1 text-[10px] uppercase tracking-wider text-muted">Name or tooltip<input name="q" defaultValue={query} placeholder="Search items, slots, types…" className="mt-1 block w-full rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" /></label>
          <label className="text-[10px] uppercase tracking-wider text-muted">Quality<select name="quality" defaultValue={String(quality)} className="mt-1 block rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment"><option value="all">All</option>{Object.entries(itemQualityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-wider text-muted">Slot<select name="slot" defaultValue={slot} className="mt-1 block rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment"><option value="all">All</option>{itemSlots.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-wider text-muted">Type<select name="type" defaultValue={itemType} className="mt-1 block max-w-36 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment"><option value="all">All</option>{itemTypes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
          {query || status !== "all" || quality !== "all" || slot !== "all" || itemType !== "all" ? <Link href="/search" className="px-2 py-2 text-xs text-muted hover:text-parchment">Clear</Link> : null}
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {(Object.keys(itemStatusLabels) as string[]).map((key) => <Link key={key} href={href({ status: key, page: 1 })} className={`rounded-full border px-3 py-1.5 text-xs ${status === key ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}>{itemStatusLabels[key]} <span className="text-muted/60">{(key === "all" ? itemCounts.total : itemCounts[key as keyof typeof itemCounts]).toLocaleString()}</span></Link>)}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
          <p className="text-xs text-muted">{query ? <>Results for “{query}” · </> : null}{filtered.length.toLocaleString()} items</p>
          <span className="text-[10px] text-muted/60">Page {currentPage} / {totalPages}</span>
        </div>

        <div className="panel mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted"><tr><th className="px-3 py-2 font-normal">Name</th><th className="px-3 py-2 font-normal">Item level</th><th className="px-3 py-2 font-normal">Required</th><th className="px-3 py-2 font-normal">Slot</th><th className="px-3 py-2 font-normal">Type</th><th className="px-3 py-2 font-normal">Source</th><th className="px-3 py-2 font-normal">Status</th></tr></thead>
            <tbody>
              {rows.map((item) => <tr key={item.i} className="border-t border-line/40 hover:bg-white/[0.025]" title={`${item.n} · ${itemQualityLabels[item.q] ?? "Item"}${item.c ? ` · ${item.c}` : ""}`}><td className="px-3 py-2"><Link href={`/items/${item.i}`} className="flex items-center gap-2"><img src={iconUrl(item)} alt="" width={28} height={28} className="size-7 rounded border border-line/70 object-cover" loading="lazy" /><span className="max-w-56 truncate" style={{ color: itemQualityColors[item.q] ?? "#ede7d7" }}>{item.n}</span></Link></td><td className="px-3 py-2 text-muted">{item.l ?? "—"}</td><td className="px-3 py-2 text-muted">{item.r ?? "—"}</td><td className="px-3 py-2 text-muted">{item.s || "—"}</td><td className="px-3 py-2 text-muted">{item.c || "—"}</td><td className="max-w-48 px-3 py-2 text-muted">{item.src || "—"}</td><td className="px-3 py-2"><span className={item.st === "new" ? "text-[#6fcf97]" : item.st === "changed" ? "text-gold-soft" : item.st === "same" ? "text-muted" : "text-[#ff6b6b]"}>{statusLabel(item.st)}</span></td></tr>)}
              {rows.length === 0 ? <tr><td colSpan={7} className="px-3 py-10 text-center text-muted">No items match those filters.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[10px] text-muted/60">Hover for tooltips; select a row for details</span>
          <div className="flex gap-2">
            {currentPage > 1 ? <Link href={href({ page: currentPage - 1 })} className="rounded border border-line px-3 py-1.5 text-xs text-muted hover:border-gold/40 hover:text-parchment">← Previous</Link> : null}
            {currentPage < totalPages ? <Link href={href({ page: currentPage + 1 })} className="rounded border border-line px-3 py-1.5 text-xs text-muted hover:border-gold/40 hover:text-parchment">Next →</Link> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
