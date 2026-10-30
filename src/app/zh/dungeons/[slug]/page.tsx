import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foreverDungeons } from "@/lib/forever";
import { fcSlugById, getDungeonImagePath, getDungeonMap, getFcDungeonBySlug } from "@/lib/dungeon-fc";
import { getDetailBossCards, getDungeonDetail, getDungeonReveal, uniqueBossLoot } from "@/lib/dungeon-details";
import zhItems from "@/data/items-zh.json";

type Params = { slug: string };
const zhNames: Record<string,string> = Object.fromEntries((foreverDungeons as { id:string; nameZh?:string; name:string }[]).map((d) => [d.id, d.nameZh || d.name]));
const zhByCanonical: Record<string,string> = Object.fromEntries((foreverDungeons as { id:string; nameZh?:string; name:string }[]).map((d) => [fcSlugById[d.id] ?? d.id, d.nameZh || d.name]));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params; const found = getDungeonDetail(slug);
  if (!found) return { title: "副本不存在" };
  const name = zhByCanonical[found.slug] || found.detail.h1;
  return { title: `${name} — 副本掉落与首领`, description: `${name}：等级、地图、首领与掉落。`, alternates: { canonical: `/zh/dungeons/${found.slug}`, languages: { en: `/dungeons/${found.slug}`, "zh-Hans": `/zh/dungeons/${found.slug}`, "x-default": `/dungeons/${found.slug}` } } };
}

export default async function ZhDungeonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params; const found = getDungeonDetail(slug); if (!found) notFound();
  const { detail } = found; const fc = getFcDungeonBySlug(found.slug);
  const zhName = zhByCanonical[found.slug] || zhNames[slug] || detail.h1;
  const map = getDungeonMap(found.slug); const mapImage = getDungeonImagePath(fc?.map ?? null);
  const reveal = getDungeonReveal(found.slug); const drops = uniqueBossLoot(detail);
  const bossCards = getDetailBossCards(detail);
  const zhNameOf = (href: string, fallback: string) => { const id = href.match(/\/item\/(\d+)/)?.[1]; return (id && (zhItems as Record<string,string>)[id]) || fallback; };
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/zh/dungeons" className="hover:text-gold-soft">副本资料</Link> / <span className="text-parchment/80">{zhName}</span></div>
      <section className="container-x max-w-5xl pb-20 pt-8">
        <p className="eyebrow">副本 · 中文资料</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">{zhName}</h1>
        <p className="mt-1 text-sm text-muted">{detail.h1} · {detail.before?.sub || ""}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4"><div className="panel p-4"><p className="text-[10px] text-muted">首领</p><p className="mt-1 text-xl text-parchment">{fc?.bossCount ?? bossCards.filter((s) => s.kind === "boss").length}</p></div><div className="panel p-4"><p className="text-[10px] text-muted">掉落</p><p className="mt-1 text-xl text-parchment">{reveal?.bossLootCount ?? drops.length}</p></div><div className="panel p-4"><p className="text-[10px] text-muted">任务</p><p className="mt-1 text-xl text-parchment">{detail.quests?.groups.reduce((sum, g) => sum + g.quests.length, 0) ?? "—"}</p></div><div className="panel p-4"><p className="text-[10px] text-muted">等级</p><p className="mt-1 text-xl text-parchment">{fc?.levelMin ?? "?"}–{fc?.levelMax ?? "?"}</p></div></div>
        {mapImage ? <section className="mt-8"><h2 className="display text-xl text-parchment">地图与首领</h2><div className="relative mt-3 overflow-hidden rounded-lg border border-line/70" style={{ aspectRatio: `${map?.width ?? 16} / ${map?.height ?? 9}` }}><img src={mapImage} alt={`${zhName} 地图`} className="h-full w-full object-cover" />{(map?.pins ?? []).map((pin) => <span key={`${pin.name}-${pin.x}`} className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold bg-abyss" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} title={pin.name} />)}</div></section> : null}
        <section className="mt-8"><h2 className="display text-xl text-parchment">首领与掉落</h2><div className="mt-3 space-y-3">{bossCards.map((section) => <details key={section.sectionId || section.name} className="panel p-4" open><summary className="cursor-pointer text-sm text-parchment">{section.name} <span className="text-[10px] text-muted">{section.kind === "boss" ? "首领" : "额外来源"}</span></summary><ul className="mt-2 space-y-1 text-sm text-muted">{section.items.map((item) => { const id = item.href.match(/\/item\/(\d+)/)?.[1]; return <li key={`${item.name}-${id}`}>{id ? <Link href={`/zh/items/${id}`} className="hover:text-gold-soft">{zhNameOf(item.href, item.name)}</Link> : zhNameOf(item.href, item.name)} <span className="text-[10px] text-muted/60">{item.type}</span></li>; })}</ul></details>)}</div></section>
      </section>
    </main>
  );
}
