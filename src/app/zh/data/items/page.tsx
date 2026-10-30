import type { Metadata } from "next";
import Link from "next/link";
import items from "@/data/items-zh-full.json";

export const metadata: Metadata = { title: "物品数据库 — 魔兽世界：无限", description: "蓝色隐士中文物品数据库：名称、品质、物品等级与部位。", alternates: { canonical: "/zh/data/items", languages: { en: "/items", "zh-Hans": "/zh/data/items", "x-default": "/items" } } };
type Item = { i:number; n:string; q:number; l:number|null; ic:string; it:number; c:number };
const qc:Record<number,string>={0:"#9d9d9d",1:"#fff",2:"#1eff00",3:"#0070d9",4:"#a335ee",5:"#ff8000",6:"#e6cc80"};
const slot:Record<number,string>={1:"头部",2:"颈部",3:"肩部",5:"胸部",6:"腰部",7:"腿部",8:"脚",9:"手腕",10:"手",11:"手指",12:"饰品",13:"单手",14:"副手",15:"远程",16:"背部",17:"双手",20:"胸部",21:"主手",22:"副手",23:"副手物品"};
export default async function ZhItemDbPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams; const query = q.trim().toLowerCase();
  const list = (items as Item[]).filter((x) => !query || x.n.toLowerCase().includes(query)).slice(0, 120);
  return (
    <main>
      <section className="container-x py-10 md:py-14"><p className="eyebrow">物品 · 中文数据库</p><h1 className="display mt-2 text-3xl text-parchment md:text-5xl">物品数据库</h1><p className="mt-3 text-sm text-muted">共 {(items as Item[]).length.toLocaleString()} 件物品 · 数据来源：蓝色隐士</p><form method="get" className="panel mt-5 flex max-w-2xl gap-2 p-3"><input name="q" defaultValue={q} placeholder="按中文物品名搜索" className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment" /><button className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold-soft">搜索</button></form></section>
      <section className="container-x pb-20"><p className="text-xs text-muted">显示 {list.length} 件</p><div className="panel mt-3 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted"><tr><th className="px-3 py-2">名称</th><th className="px-3 py-2">物品等级</th><th className="px-3 py-2">部位</th><th className="px-3 py-2">品质</th></tr></thead><tbody>{list.map((item) => <tr key={item.i} className="border-t border-line/40"><td className="px-3 py-2"><Link href={`/zh/items/${item.i}`} className="flex items-center gap-2"><img src={`https://wowforever.wclbox.com/tubiao/${item.ic}`} alt="" width={26} height={26} className="size-6 rounded" /><span style={{color:qc[item.q]??"#eee"}}>{item.n}</span></Link></td><td className="px-3 py-2 text-muted">{item.l ?? "—"}</td><td className="px-3 py-2 text-muted">{slot[item.it] ?? "—"}</td><td className="px-3 py-2 text-muted">{["粗糙","普通","优秀","精良","史诗","传说","神器"][item.q] ?? "—"}</td></tr>)}</tbody></table></div></section>
    </main>
  );
}
