import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import data from "@/data/bis-zh.json";

type Params = { slug: string };
type Slot = { s: string; name: string; en: string; icon: string; id: number; q: number; ilvl: number; src: string; enchant: string };
type Set = { tag: string; side: number; slots: Slot[] };
const names: Record<string,string> = { warrior:"战士", paladin:"圣骑士", hunter:"猎人", rogue:"潜行者", priest:"牧师", shaman:"萨满祭司", mage:"法师", warlock:"术士", druid:"德鲁伊" };
const qc: Record<number,string> = {0:"#9d9d9d",1:"#fff",2:"#1eff00",3:"#0070d9",4:"#a335ee",5:"#ff8000"};
const sets = data as Record<string, Set[]>;

export async function generateStaticParams(): Promise<Params[]> { return Object.keys(sets).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params; const name = names[slug] || slug;
  return { title: `${name} BiS 配装 — 魔兽世界：无限`, description: `${name} 中文 BiS 配装，按专精和部位列出装备、来源与等级。`, alternates: { canonical: `/zh/bis/${slug}`, languages: { en: `/bis?class=${slug}`, "zh-Hans": `/zh/bis/${slug}`, "x-default": `/bis?class=${slug}` } } };
}

export default async function ZhBisPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<{ spec?: string }> }) {
  const { slug } = await params; const query = await searchParams;
  const list = sets[slug]; if (!list) notFound();
  const index = Math.max(0, Math.min((list.findIndex((s) => String(s.tag) === query.spec) + 1 || 1) - 1, list.length - 1));
  const set = list[index];
  const name = names[slug] || slug;
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/zh/bis" className="hover:text-gold-soft">BiS 配装</Link> / <span className="text-parchment/80">{name}</span></div>
      <section className="container-x pb-20 pt-8">
        <p className="eyebrow">BiS · 中文配装</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">{name} 最佳装备</h1>
        <p className="mt-2 text-sm text-muted">数据来源：蓝色隐士 · {list.length} 套配装</p>
        <div className="mt-4 flex flex-wrap gap-2">{list.map((entry, i) => <Link key={`${entry.tag}-${i}`} href={`/zh/bis/${slug}?spec=${encodeURIComponent(entry.tag)}`} className={`rounded-lg border px-3 py-1.5 text-xs ${i === index ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:text-parchment"}`}>{entry.tag}</Link>)}</div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{set.slots.map((item) => <Link key={`${item.s}-${item.id}`} href={`/zh/items/${item.id}`} className="panel panel-hover flex items-center gap-3 p-3"><img src={`https://wowforever.wclbox.com/tubiao/${item.icon}`} alt="" width={40} height={40} className="size-10 rounded border border-line/70 object-cover" /><span className="min-w-0"><span className="block text-[10px] text-muted">{item.s} · iLvl {item.ilvl ?? "—"}</span><span className="block truncate text-sm" style={{ color: qc[item.q] ?? "#ede7d7" }}>{item.name}</span>{item.enchant ? <span className="block truncate text-[10px] text-gold/70">{item.enchant}</span> : null}{item.src ? <span className="mt-0.5 block truncate text-[10px] text-muted/60">{item.src}</span> : null}</span></Link>)}</div>
      </section>
    </main>
  );
}
