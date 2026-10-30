import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import data from "@/data/professions-zh.json";
type P = { name:string; icon:string; recipeCount:number };
type R = { name:string; skill:number; quality:number; icon:string; itemId:number; prof:string; reagents:{name:string;count:number;icon:string}[] };
const profs = data.professions as P[]; const recipes = data.recipes as R[];
const slugMap:Record<string,string>={alchemy:"炼金术",blacksmithing:"锻造",tailoring:"裁缝",engineering:"工程学",enchanting:"附魔",leatherworking:"制皮",cooking:"烹饪","first-aid":"急救",mining:"采矿",herbalism:"草药学",fishing:"钓鱼",skinning:"剥皮"};
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const {slug}=await params; const name=slugMap[slug]||slug; return { title:`${name}配方 — 魔兽世界：无限`, alternates:{canonical:`/zh/professions/${slug}`,languages:{en:`/professions?p=${slug}`,"zh-Hans":`/zh/professions/${slug}`,"x-default":`/professions?p=${slug}`}} }; }
export default async function ZhProfessionPage({ params, searchParams }: { params: Promise<{slug:string}>; searchParams: Promise<{q?:string}> }) {
  const {slug}=await params; const {q=""}=await searchParams; const profName=slugMap[slug]; if(!profName) notFound(); const prof=profs.find(p=>p.name===profName);
  const list=recipes.filter(r=>r.prof===profName && (!q || r.name.includes(q))).slice(0,120);
  return <main><section className="container-x py-10 md:py-14"><p className="eyebrow">专业 · 中文配方</p><h1 className="display mt-2 text-3xl text-parchment md:text-5xl">{profName}</h1><p className="mt-2 text-sm text-muted">{prof?.recipeCount ?? list.length} 个配方 · 数据来源：蓝色隐士</p><form method="get" className="panel mt-5 flex max-w-xl gap-2 p-3"><input name="q" defaultValue={q} placeholder="搜索配方或材料" className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment" /><button className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold-soft">搜索</button></form></section><section className="container-x grid gap-3 pb-20 sm:grid-cols-2 lg:grid-cols-3">{list.map(r=><div key={`${r.name}-${r.skill}`} className="panel p-4"><div className="flex items-start gap-2"><img src={`https://wowforever.wclbox.com/tubiao/${r.icon}`} alt="" width={32} height={32} className="size-8 rounded" /><div><p className="text-sm text-parchment">{r.name}</p><p className="text-[10px] text-muted">技能 {r.skill} · 物品 {r.itemId}</p></div></div><ul className="mt-2 space-y-1 text-[10px] text-muted">{r.reagents.map(x=><li key={`${x.name}-${x.count}`}>{x.name} ×{x.count}</li>)}</ul></div>)}</section></main>;
}
