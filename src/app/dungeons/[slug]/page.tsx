import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dungeons, getDungeon, getItemsBySource, qualityColors } from "@/lib/data";
import { foreverDungeons } from "@/lib/forever";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/site";
import { getDungeonStats } from "@/lib/dungeon-stats";
import { getDungeonImagePath, getDungeonMap, getFcDungeon } from "@/lib/dungeon-fc";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return Array.from(new Set([...dungeons.map((d) => d.id), ...foreverDungeons.map((d) => d.id)])).map((slug) => ({ slug }));
}

function resolveDungeon(slug: string) {
  return foreverDungeons.find((d) => d.id === slug) ?? getDungeon(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dungeon = resolveDungeon(slug);
  if (!dungeon) return { title: "Dungeon not found" };
  return {
    title: `${dungeon.name} — loot, level band, and purpose`,
    description: `${dungeon.name}: level ${dungeon.band} ${dungeon.type.toLowerCase()}. ${dungeon.note}`,
    alternates: { canonical: `/dungeons/${dungeon.id}` },
  };
}

export default async function DungeonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const dungeon = resolveDungeon(slug);
  if (!dungeon) notFound();

  const drops = getItemsBySource(dungeon.name);
  const foreverStats = getDungeonStats(dungeon.id);
  const fcDungeon = getFcDungeon(dungeon.id);
  const dungeonMap = getDungeonMap(dungeon.id);
  const mapImage = getDungeonImagePath(fcDungeon?.map ?? null);
  const isRaid = dungeon.type === "Raid";

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/dungeons", label: "Dungeons" },
            { href: `/dungeons/${dungeon.id}`, label: dungeon.name },
          ]}
        />
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">{isRaid ? "Raid" : "Dungeon"}</span>
            <span className="rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-gold-soft">
              Level {dungeon.band}
            </span>
          </div>

          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            {dungeon.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {dungeon.note}
          </p>

          <div className="gold-rule my-8" />

          {foreverStats ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {foreverStats.bossCount != null ? <div className="panel p-4"><p className="text-xs uppercase tracking-wider text-muted">Bosses</p><p className="mt-1 text-sm text-parchment">{foreverStats.bossCount}</p></div> : null}
              {foreverStats.questCount != null ? <div className="panel p-4"><p className="text-xs uppercase tracking-wider text-muted">Quests</p><p className="mt-1 text-sm text-parchment">{foreverStats.questCount}</p></div> : null}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Type</p>
              <p className="mt-1 text-sm text-parchment">
                {isRaid ? "Raid" : "5-player dungeon"}
              </p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Level band</p>
              <p className="mt-1 text-sm text-parchment">{dungeon.band}</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Verified drops</p>
              <p className="mt-1 text-sm text-parchment">{drops.length}</p>
            </div>
          </div>

          {mapImage && dungeonMap ? (
            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="display text-xl text-parchment">Dungeon map</h2>
                  <p className="mt-1 text-xs text-muted">{(dungeonMap.pins?.length ?? 0) > 0 ? `${dungeonMap.pins?.length} boss pins` : "Map only"}</p>
                </div>
                <span className="text-[10px] text-muted/60">ForeverChanges map</span>
              </div>
              <div className="relative mt-3 overflow-hidden rounded-lg border border-line/70 bg-deep" style={{ aspectRatio: `${dungeonMap.width ?? 16} / ${dungeonMap.height ?? 9}` }}>
                <img src={mapImage} alt={`${dungeon.name} map`} className="h-full w-full object-cover" />
                {(dungeonMap.pins ?? []).map((pin) => (
                  <span key={`${pin.name}-${pin.x}-${pin.y}`} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} title={pin.name}>
                    <span className="grid size-5 place-items-center rounded-full border border-gold/80 bg-abyss/90 text-[9px] font-bold text-gold-soft shadow-lg">×</span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-line bg-panel px-1.5 py-0.5 text-[10px] text-parchment group-hover:block">{pin.name}</span>
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {fcDungeon && (fcDungeon.bosses.length > 0 || fcDungeon.lootFull.length > 0) ? (
            <section className="mt-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {fcDungeon.bosses.length > 0 ? <div className="panel p-4"><p className="eyebrow">Bosses</p><ul className="mt-2 space-y-1 text-sm text-muted">{fcDungeon.bosses.map((boss) => <li key={boss}>{boss}</li>)}</ul></div> : null}
                {fcDungeon.lootFull.length > 0 ? <div className="panel p-4"><p className="eyebrow">Drops</p><p className="mt-2 text-2xl text-parchment">{fcDungeon.lootCount ?? fcDungeon.lootFull.length}</p><p className="text-xs text-muted">items in the full drop list</p></div> : null}
              </div>
              {fcDungeon.lootFull.length > 0 ? (
                <details className="panel mt-3 p-4">
                  <summary className="cursor-pointer text-sm text-gold/85">Show full drop list ({fcDungeon.lootFull.length})</summary>
                  <div className="mt-3 max-h-80 overflow-y-auto text-xs leading-relaxed text-muted">
                    <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">{fcDungeon.lootFull.map((item, index) => <p key={`${item}-${index}`}>{item}</p>)}</div>
                  </div>
                </details>
              ) : null}
            </section>
          ) : null}

          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="display text-xl text-parchment">Notable drops</h2>
              <Link
                href="/database"
                className="text-xs text-gold/90 transition-colors hover:text-gold-soft"
              >
                Full database →
              </Link>
            </div>

            {drops.length > 0 ? (
              <ul className="mt-4 divide-y divide-line/60">
                {drops.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <Link
                        href={`/database/items/${item.id}`}
                        className="text-sm transition-colors hover:underline hover:underline-offset-2"
                        style={{ color: qualityColors[item.quality] ?? "#ede7d7" }}
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {item.slot} · {item.phase}
                      </p>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-muted">
                      {item.quality}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="panel mt-4 p-5 text-sm leading-relaxed text-muted">
                <p className="font-medium text-parchment">Drops pending verification</p>
                <p className="mt-1">
                  This {isRaid ? "raid" : "dungeon"}&apos;s loot table is being
                  confirmed against live Forever builds. We only list items whose
                  name, slot, and source we can stand behind — no datamined
                  spreadsheets.
                </p>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="display text-xl text-parchment">Before you go</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>
                • Confirm the entrance and attunement requirements in-game — band
                ranges are the Classic baseline, not a guarantee.
              </li>
              <li>
                • Bring the quest chains that reward pre-raid gear; a single clean
                run beats five unfinished ones.
              </li>
              <li>
                • For group composition and launch pacing, read the{" "}
                <Link href="/guides/leveling-1-20-launch-route" className="text-gold/90 hover:text-gold-soft">
                  1–20 route guide
                </Link>
                .
              </li>
            </ul>
          </section>

          <p className="mt-10 text-xs text-muted/70">
            {site.name} is a fan-made resource. Instances and item names are the
            property of Blizzard Entertainment.
          </p>
        </div>
      </section>
    </main>
  );
}
