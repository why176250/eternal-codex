import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import names from "@/data/items-zh.json";
import { getFcItem } from "@/lib/fc-items";
import { getWclItem } from "@/lib/wcl-items";

type Params = { id: string };
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params; const name = (names as Record<string,string>)[id] || "物品";
  return { title: `${name} — 魔兽世界：无限物品`, alternates: { canonical: `/zh/items/${id}`, languages: { en: `/items/${id}`, "zh-Hans": `/zh/items/${id}`, "x-default": `/items/${id}` } } };
}
export default async function ZhItemPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const zhName = (names as Record<string,string>)[id];
  const fc = getFcItem(id); const wcl = getWclItem(id);
  if (!zhName && !fc && !wcl) notFound();
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/search" className="hover:text-gold-soft">物品数据库</Link> / <span className="text-parchment/80">{zhName || fc?.name || wcl?.n}</span></div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <p className="eyebrow">物品 · 中文名</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{zhName || fc?.name || wcl?.n}</h1>
        <p className="mt-2 text-sm text-muted">{fc?.name || wcl?.n} · 物品 ID {id}</p>
        {fc ? <div className="panel mt-5 p-5 text-sm leading-relaxed text-muted">{fc.stats?.length ? <ul className="space-y-1">{fc.stats.map((s) => <li key={s} className="text-[#6fcf97]">{s}</li>)}</ul> : null}{fc.effect?.map((e) => <p key={e} className="mt-2 text-gold-soft">{e}</p>)}{fc.summary ? <p className="mt-3 text-xs text-muted/70">{fc.summary}</p> : null}</div> : <p className="panel mt-5 p-5 text-sm text-muted">该物品的中文数据已收录，详细属性页正在整理。</p>}
      </section>
    </main>
  );
}
