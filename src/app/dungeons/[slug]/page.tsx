import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foreverDungeons } from "@/lib/forever";
import { getDungeonImagePath, getDungeonMap, getFcDungeon } from "@/lib/dungeon-fc";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return foreverDungeons.map((dungeon) => ({ slug: dungeon.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const dungeon = getFcDungeon(slug);
  if (!dungeon) return { title: "Dungeon not found" };
  return {
    title: `${dungeon.name} — bosses, map, loot, and quests`,
    description: `${dungeon.name}: level ${dungeon.levelMin ?? "?"}–${dungeon.levelMax ?? "?"}, ${dungeon.bossCount ?? "?"} bosses, ${dungeon.lootFull.length} drops.`,
    alternates: { canonical: `/dungeons/${slug}` },
  };
}

export default async function DungeonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const dungeon = getFcDungeon(slug);
  if (!dungeon) notFound();
  const map = getDungeonMap(slug);
  const mapImage = getDungeonImagePath(dungeon.map);
  const bossLoot = dungeon.bosses.map((boss, index) => ({
    boss,
    items: index === 0 && dungeon.firstBossLoot?.length
      ? dungeon.firstBossLoot
      : dungeon.lootFull.filter((item) => item.toLowerCase().includes(boss.toLowerCase())),
  }));

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs items={[{ href: "/dungeons", label: "Dungeons" }, { href: `/dungeons/${slug}`, label: dungeon.name }]} />
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">Dungeon</span>
            <span className="rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-gold-soft">
              Level {dungeon.levelMin ?? "?"}–{dungeon.levelMax ?? "?"}
            </span>
            {dungeon.location ? <span className="text-muted">{dungeon.location}</span> : null}
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">{dungeon.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {dungeon.location ?? "Location not listed in the current import."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Bosses</p><p className="mt-1 text-xl text-parchment">{dungeon.bossCount ?? dungeon.bosses.length}</p></div>
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Quests</p><p className="mt-1 text-xl text-parchment">{dungeon.questCount ?? "—"}</p></div>
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Verified drops</p><p className="mt-1 text-xl text-parchment">{dungeon.lootCount ?? dungeon.lootFull.length}</p></div>
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Map</p><p className="mt-1 text-sm text-parchment">{mapImage ? (map ? "Available" : "Map only") : "—"}</p></div>
          </div>

          {mapImage ? (
            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><h2 className="display text-xl text-parchment">Dungeon map</h2><p className="mt-1 text-xs text-muted">{map?.pins?.length ?? 0} boss pins</p></div>
                <span className="text-[10px] text-muted/60">ForeverChanges map</span>
              </div>
              <div className="relative mt-3 overflow-hidden rounded-lg border border-line/70 bg-deep" style={{ aspectRatio: `${map?.width ?? 16} / ${map?.height ?? 9}` }}>
                <img src={mapImage} alt={`${dungeon.name} map`} className="h-full w-full object-cover" />
                {(map?.pins ?? []).map((pin) => (
                  <span key={`${pin.name}-${pin.x}-${pin.y}`} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} title={pin.name}>
                    <span className="grid size-5 place-items-center rounded-full border border-gold/80 bg-abyss/90 text-[9px] font-bold text-gold-soft shadow-lg">×</span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-line bg-panel px-1.5 py-0.5 text-[10px] text-parchment group-hover:block">{pin.name}</span>
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="display text-xl text-parchment">Boss drops</h2><p className="mt-1 text-xs text-muted">Bosses, first-boss drops, and attributed items.</p></div>
              <span className="text-[10px] text-muted/60">{dungeon.bosses.length} bosses</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {bossLoot.map(({ boss, items }, index) => (
                <article key={boss} className="panel p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line/80 bg-deep text-sm text-gold-soft">{boss.slice(0, 1)}</span>
                    <div className="min-w-0"><p className="truncate text-sm text-parchment">{boss}</p><p className="text-[10px] text-muted">Boss {index + 1}</p></div>
                  </div>
                  {items.length > 0 ? <ul className="mt-3 space-y-1 border-t border-line/50 pt-2 text-xs text-muted">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 border-t border-line/50 pt-2 text-[10px] text-muted/60">Per-boss split is not available; see the full drop list below.</p>}
                </article>
              ))}
            </div>
          </section>

          {dungeon.lootFull.length > 0 ? (
            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><h2 className="display text-xl text-parchment">Full drop table</h2><p className="mt-1 text-xs text-muted">{dungeon.lootFull.length} items from the expanded “See all drops” list.</p></div>
                <span className="text-[10px] text-muted/60">ForeverChanges</span>
              </div>
              <div className="panel mt-3 max-h-96 overflow-y-auto p-4">
                <div className="grid gap-x-6 gap-y-1 text-xs leading-relaxed text-muted sm:grid-cols-2">
                  {dungeon.lootFull.map((item: string, index: number) => <p key={`${item}-${index}`}>{item}</p>)}
                </div>
              </div>
            </section>
          ) : null}

          {dungeon.factionQuests && dungeon.factionQuests.length > 0 ? (
            <section className="mt-10">
              <h2 className="display text-xl text-parchment">Quests</h2>
              <div className="panel mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted"><tr><th className="px-4 py-2 text-left font-normal">Faction</th><th className="px-4 py-2 text-left font-normal">Quests</th><th className="px-4 py-2 text-left font-normal">XP</th></tr></thead>
                  <tbody>{dungeon.factionQuests.map((row) => <tr key={row.faction} className="border-t border-line/40"><td className="px-4 py-2 text-parchment">{row.faction}</td><td className="px-4 py-2 text-muted">{row.quests}</td><td className="px-4 py-2 text-muted">{row.xp}</td></tr>)}</tbody>
                </table>
              </div>
            </section>
          ) : null}

          <p className="mt-10 text-[10px] leading-relaxed text-muted/60">Boss names, map, full loot, and faction quests from ForeverChanges. Level ranges are approximate; verify requirements in game.</p>
        </div>
      </section>
    </main>
  );
}
