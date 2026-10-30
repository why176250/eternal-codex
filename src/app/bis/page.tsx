import type { Metadata } from "next";
import Link from "next/link";
import { bisClasses, getBisClass } from "@/lib/wcl-bis";

export const metadata: Metadata = {
  title: "BiS gear — WoW Forever level 30",
  description: "Level 30 best-in-slot gear for every WoW Forever class, with slots, enchants, stats, alternatives, and sources.",
  alternates: { canonical: "/bis" },
};

type SearchParams = Promise<{ class?: string; side?: string }>;
const qualityColors: Record<number, string> = { 0: "#9d9d9d", 1: "#ffffff", 2: "#1eff00", 3: "#0070dd", 4: "#a335ee", 5: "#ff8000", 6: "#e6cc80" };

function iconUrl(icon: string) {
  return icon ? (icon.startsWith("http") ? icon : `https://wowforever.wclbox.com${icon}`) : "";
}

export default async function BisPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selected = bisClasses.some((entry) => entry.slug === params.class) ? params.class! : "warrior";
  const side = params.side === "h" ? "h" : "a";
  const entry = getBisClass(selected);
  if (!entry) return null;
  const { data, meta } = entry;
  const equipment = data.equipment[side] ?? data.equipment.a ?? [];
  const stats = data.statGroups[side] ?? data.statGroups.a ?? [];
  const gear = equipment.filter((item) => item.name);
  const build = data.builds[0];

  function classHref(slug: string) {
    const p = new URLSearchParams();
    p.set("class", slug);
    if (side === "h") p.set("side", "h");
    return `/bis?${p.toString()}`;
  }

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-9 md:py-12">
          <p className="eyebrow">BiS gear · Level 30</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="display text-3xl text-parchment md:text-5xl">{meta.name} <span className="text-gold-soft">Best in Slot</span></h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Recommended level 30 {meta.name} gear by slot, with stats, enchants, and sources. Click an item to see its page.</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {bisClasses.map((cls) => <Link key={cls.slug} href={classHref(cls.slug)} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors ${cls.slug === selected ? "border-gold/55 bg-gold/10 text-parchment" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}><img src={cls.icon} alt="" width={22} height={22} className="size-5 rounded border border-line/70 object-cover" /><span>{cls.name}</span></Link>)}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-muted">Faction:</span>
            <Link href={`/bis?class=${selected}${side === "h" ? "&side=a" : ""}`} className={`rounded-full border px-2.5 py-1 ${side === "a" ? "border-gold/55 text-gold-soft" : "border-line/60 text-muted"}`}>Alliance</Link>
            <Link href={`/bis?class=${selected}${side === "a" ? "&side=h" : ""}`} className={`rounded-full border px-2.5 py-1 ${side === "h" ? "border-gold/55 text-gold-soft" : "border-line/60 text-muted"}`}>Horde</Link>
            <span className="ml-2 text-muted/60">PvE · Level 30 · Build 1.60.1.70685</span>
          </div>
        </div>
      </section>

      <section className="container-x py-7">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <div className="panel p-4">
              <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="eyebrow">Character equipment</p><h2 className="display mt-1 text-xl text-parchment">{side === "a" ? "Alliance" : "Horde"} setup</h2></div><span className="text-[10px] text-muted/60">{gear.length} slots</span></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {gear.map((item) => <Link key={`${item.slot}-${item.id}`} href={`/items/${item.id}`} className="flex items-center gap-3 rounded-lg border border-line/60 bg-deep/30 p-2.5 transition-colors hover:border-gold/40"><img src={iconUrl(item.icon)} alt="" width={40} height={40} className="size-10 shrink-0 rounded border border-line/70 object-cover" /><span className="min-w-0"><span className="block truncate text-sm" style={{ color: qualityColors[data.items?.[item.id]?.quality ?? 3] ?? "#ede7d7" }}>{item.name}</span><span className="block text-[10px] text-muted">{item.label}{item.enchant ? ` · ${item.enchant}` : ""}</span></span></Link>)}
              </div>
            </div>

            <div className="panel mt-4 p-4">
              <p className="eyebrow">Slot alternatives</p>
              <div className="mt-3 space-y-2">
                {data.slots.filter((slot) => slot.name !== "Consumables").map((slot) => <details key={slot.key} className="rounded-lg border border-line/50 bg-deep/30"><summary className="cursor-pointer px-3 py-2 text-sm text-parchment">{slot.name}<span className="ml-2 text-[10px] text-muted">{slot.items.length} options</span></summary><div className="border-t border-line/40 p-2">{slot.items.map((item) => <Link key={`${slot.key}-${item.id}`} href={`/items/${item.id}`} className="flex items-center gap-2 rounded px-1 py-1 text-xs hover:bg-white/[0.04]"><img src={iconUrl(item.icon)} alt="" width={24} height={24} className="size-6 rounded border border-line/70 object-cover" /><span className="min-w-0 flex-1 truncate" style={{ color: qualityColors[item.quality] ?? "#ede7d7" }}>{item.name}</span><span className="truncate text-[10px] text-muted">{item.sources?.[0]?.text ?? ""}</span></Link>)}</div></details>)}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            {build ? <div className="panel p-4"><p className="eyebrow">Recommended talents</p><p className="mt-2 text-sm text-parchment">{build.name} · {build.total} points</p><div className="mt-2 space-y-1 text-[11px] text-muted">{build.trees.map((tree) => <p key={tree.name}>{tree.name}: {tree.points} points</p>)}</div><Link href="/tools/build" className="mt-3 inline-block text-[10px] text-gold/85 hover:text-gold-soft">Open talent planner →</Link></div> : null}
            <div className="panel p-4"><p className="eyebrow">Overview</p><div className="mt-3 space-y-3">{stats.map((group) => <div key={group.name}><p className="text-[10px] uppercase tracking-wider text-muted">{group.name}</p><div className="mt-1 space-y-0.5">{group.values.map((stat) => <p key={stat.name} className="flex justify-between gap-2 text-[11px]"><span className="text-muted">{stat.name}</span><span className={stat.up ? "text-[#6fcf97]" : "text-parchment/80"}>{stat.value}</span></p>)}</div></div>)}</div></div>
            <div className="panel p-4 text-[11px] leading-relaxed text-muted/70">Calculated from the first item in each slot, two rings and the listed enchants, using level 30 class and racial base stats. Excludes buffs and talents.</div>
          </aside>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-xs"><Link href="/bis/forever" className="text-gold/85 hover:text-gold-soft">65 Forever BIS lists →</Link><Link href="/bis/builds" className="text-muted hover:text-parchment">Build browser →</Link><a href="https://wowforever.wclbox.com/en/peizhuang/warrior" target="_blank" rel="noreferrer" className="text-muted hover:text-parchment">Source: WCLBoxBiS →</a></div>
      </section>
    </main>
  );
}
