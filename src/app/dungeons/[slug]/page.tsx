import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fcSlugById, getDungeonImagePath, getDungeonMap, getFcDungeonBySlug, resolveFcSlug } from "@/lib/dungeon-fc";
import {
  getDetailBossCards,
  getDungeonDetail,
  getDungeonDirectory,
  getDungeonReveal,
  getMapDimensions,
  uniqueBossLoot,
  type DetailItem,
} from "@/lib/dungeon-details";

type Params = { slug: string };
const qualityColors: Record<string, string> = {
  "0": "#9d9d9d", "1": "#ffffff", "2": "#1eff00", "3": "#4aa3ff", "4": "#a335ee",
};

function itemId(href: string) {
  return href.match(/\/item\/(\d+)/)?.[1] ?? "";
}

function ItemRow({ item, size = 28 }: { item: DetailItem; size?: number }) {
  const id = itemId(item.href);
  const content = (
    <>
      {item.icon ? <img src={`https://foreverchanges.pro${item.icon}`} alt="" width={size} height={size} className="shrink-0 rounded border border-line/70 object-cover" style={{ width: size, height: size }} loading="lazy" /> : <span className="grid shrink-0 place-items-center rounded border border-line/70 bg-deep text-[9px] text-muted" style={{ width: size, height: size }}>?</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs" style={{ color: qualityColors[item.quality] ?? "#ede7d7" }}>{item.name}</span>
        {item.type ? <span className="block text-[10px] text-muted">{item.type}</span> : null}
      </span>
    </>
  );
  return id ? <Link href={`/item/${id}`} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-white/[0.03]">{content}</Link> : <div className="flex items-center gap-2 px-1 py-1">{content}</div>;
}

export function generateStaticParams(): Params[] {
  return Object.values(fcSlugById).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getDungeonDetail(slug);
  if (!found) return { title: "Dungeon not found" };
  const { detail, slug: canonical } = found;
  return { title: `${detail.h1} — bosses, map, loot, and quests`, description: detail.metaDescription, alternates: { canonical: `/dungeons/${canonical}` } };
}

export default async function DungeonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const canonical = resolveFcSlug(slug);
  if (canonical && canonical !== slug) permanentRedirect(`/dungeons/${canonical}`);
  const found = getDungeonDetail(slug);
  if (!found) return null;
  const { detail } = found;
  const directory = getDungeonDirectory(found.slug);
  const reveal = getDungeonReveal(found.slug);
  const fcDungeon = getFcDungeonBySlug(found.slug);
  const mapImage = getDungeonImagePath(fcDungeon?.map ?? null);
  const dims = getMapDimensions(found.slug);
  const mapPins = getDungeonMap(found.slug)?.pins ?? [];
  const bossCards = getDetailBossCards(detail);
  const bossEntries = bossCards.filter((section) => section.kind === "boss");
  const extraEntries = bossCards.filter((section) => section.kind !== "boss");
  const drops = uniqueBossLoot(detail);
  const dropCount = reveal?.bossLootCount ?? drops.length;
  const questCount = detail.quests?.groups.reduce((sum, group) => sum + group.quests.length, 0) ?? null;

  return (
    <main>
      <div className="container-x pt-8"><Breadcrumbs items={[{ href: "/dungeons", label: "Dungeons" }, { href: `/dungeons/${found.slug}`, label: detail.h1 }]} /></div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">Dungeon</span>
            <span className="rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-gold-soft">{detail.before?.sub ?? directory?.levelBand ?? "Level unknown"}</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">{detail.h1}</h1>
          <p className="mt-1 text-sm text-muted">{detail.subtitle}</p>
          {detail.heroLines.map((line) => <p key={line.text} className="mt-2 max-w-4xl text-sm leading-relaxed text-muted">{line.text}{line.primaryLink ? <> <a href={`https://foreverchanges.pro${line.primaryLink.href}`} className="text-gold/85 hover:text-gold-soft">{line.primaryLink.text} →</a></> : null}</p>)}
          {detail.extraHeroLink ? <p className="mt-2 text-xs"><a href={`https://foreverchanges.pro${detail.extraHeroLink.href}`} className="text-gold/85 hover:text-gold-soft">{detail.extraHeroLink.text} →</a></p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {detail.bossAvatars?.length ? detail.bossAvatars.map((boss) => <a key={boss.name} href={boss.href} className="group flex items-center gap-2 rounded-full border border-line/60 bg-deep/40 py-1 pl-1 pr-3 text-xs text-muted hover:border-gold/40 hover:text-parchment"><img src={`https://foreverchanges.pro${boss.portrait}`} alt="" width={32} height={32} className="size-8 rounded-full border border-line/70 object-cover" />{boss.name}</a>) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Bosses</p><p className="mt-1 text-xl text-parchment">{directory?.bosses ?? bossEntries.length}</p></div>
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Quests</p><p className="mt-1 text-xl text-parchment">{questCount ?? "—"}</p></div>
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Drops</p><p className="mt-1 text-xl text-parchment">{dropCount}</p></div>
            <div className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">Map</p><p className="mt-1 text-sm text-parchment">{mapImage ? "Available" : "—"}</p></div>
          </div>

          {mapImage ? (
            <section id="map" className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="display text-xl text-parchment">Map, bosses and loot</h2><p className="mt-1 text-xs text-muted">Eversixty extra · instance map with boss pins</p></div><span className="text-[10px] text-muted/60">ForeverChanges map</span></div>
              <div className="relative mt-3 overflow-hidden rounded-lg border border-line/70 bg-deep" style={{ aspectRatio: `${dims?.width ?? detail.mapAsset?.width ?? 16} / ${dims?.height ?? detail.mapAsset?.height ?? 9}` }}>
                <img src={mapImage} alt={`${detail.h1} map`} className="h-full w-full object-cover" />
                {mapPins.map((pin) => <span key={`${pin.name}-${pin.x}-${pin.y}`} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} title={pin.name}><span className="grid size-5 place-items-center rounded-full border border-gold/80 bg-abyss/90 text-[9px] font-bold text-gold-soft shadow-lg">×</span><span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-line bg-panel px-1.5 py-0.5 text-[10px] text-parchment group-hover:block">{pin.name}</span></span>)}
              </div>
            </section>
          ) : null}

          <section id="bosses" className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="display text-xl text-parchment">Bosses and loot</h2><p className="mt-1 text-xs text-muted">{bossEntries.length} bosses, {extraEntries.length} extra sources</p></div><span className="text-[10px] text-muted/60">{dropCount} drops</span></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {bossCards.map((section) => (
                <article key={section.sectionId || section.name} id={section.sectionId} className="panel p-4">
                  <div className="flex items-center gap-3">
                    {section.portrait ? <img src={`https://foreverchanges.pro${section.portrait}`} alt="" width={44} height={44} className="size-11 rounded-full border border-line/80 object-cover" /> : <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line/80 bg-deep text-sm text-gold-soft">{section.name.slice(0, 1)}</span>}
                    <div className="min-w-0"><p className="truncate text-sm text-parchment">{section.name}</p><p className="text-[10px] text-muted">{section.kind === "boss" ? section.levelText || "Boss" : section.kind === "trash" ? "Trash mobs" : "Container"}</p></div>
                  </div>
                  <ul className="mt-3 space-y-1 border-t border-line/50 pt-2">{section.items.map((item) => <li key={`${section.name}-${item.name}`}><ItemRow item={item} /></li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          {detail.before?.rows?.length ? (
            <section id="before" className="mt-10">
              <h2 className="display text-xl text-parchment">{detail.before.heading}</h2>
              <div className="panel mt-3 divide-y divide-line/50 p-4">
                {detail.before.rows.map((row) => <div key={row.key} className="grid gap-1 py-2 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]"><span className="text-muted">{row.key}</span><span className="leading-relaxed text-parchment/80">{row.text}{row.links?.map((link) => <a key={link.href} href={`https://foreverchanges.pro${link.href}`} className="ml-1 text-gold/80 hover:text-gold-soft">{link.text}</a>)}</span></div>)}
              </div>
            </section>
          ) : null}

          {detail.quests ? (
            <section id="quests" className="mt-10">
              <h2 className="display text-xl text-parchment">{detail.quests.heading}</h2>
              <p className="mt-1 text-xs text-muted">{detail.quests.sub}</p>
              <div className="panel mt-3 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm"><thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted"><tr><th className="px-3 py-2 text-left font-normal">Faction</th><th className="px-3 py-2 text-left font-normal">Quests</th><th className="px-3 py-2 text-left font-normal">Beta XP</th><th className="px-3 py-2 text-left font-normal">Classic</th><th className="px-3 py-2 text-left font-normal">Worth</th></tr></thead><tbody>{detail.quests.xpTable.map((row) => <tr key={row.faction} className="border-t border-line/40"><td className="px-3 py-2 text-parchment">{row.faction}</td><td className="px-3 py-2 text-muted">{row.quests}</td><td className="px-3 py-2 text-muted">{row.experienceBeta}</td><td className="px-3 py-2 text-muted">{row.inClassic}</td><td className="px-3 py-2 text-muted">{row.worth}</td></tr>)}</tbody></table>
              </div>
              <div className="mt-4 space-y-4">{detail.quests.groups.map((group) => <div key={group.faction}><p className="text-xs uppercase tracking-wider text-muted">{group.faction} · {group.count}</p><div className="mt-2 grid gap-2 md:grid-cols-2">{group.quests.map((quest) => <article key={quest.id} id={quest.id} className="panel p-3"><Link href={`/quests/${quest.id}`} className="text-sm text-parchment hover:text-gold-soft">{quest.name}</Link><p className="mt-0.5 text-[10px] text-muted">{quest.levelLine}</p><p className="mt-2 text-xs leading-relaxed text-muted">{quest.text}</p>{quest.rewards?.items?.length ? <p className="mt-2 text-[10px] text-gold/80">Choose one of: {quest.rewards.items.map((item) => item.name).join(", ")}</p> : null}</article>)}</div></div>)}</div>
            </section>
          ) : null}



          <p className="mt-10 text-[10px] leading-relaxed text-muted/60">Bosses, maps, loot, and quest data from ForeverChanges. Level ranges are approximate; verify requirements in game.</p>
        </div>
      </section>
    </main>
  );
}
