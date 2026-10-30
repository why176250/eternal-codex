import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import guides from "@/data/guides-zh.json";

type Seg = { s?: string; name?: string };
type Block = { type: string; text?: string; segs?: Seg[]; items?: Block[]; rows?: Seg[][][]; cap?: string; label?: string };
type Guide = { id:number; titleCn:string; groupCn:string; summaryCn:string; updateTime:string; blocks:Block[] };
const all = guides as Guide[];
const slugs: Record<string, number> = { "battle-mage": 1, "druid-cat-form": 3, "library-books": 10, "cozy-sleeping-bag": 8, "rares": 9, "whimsyfin": 12 };
const text = (segs: Seg[] = []) => segs.map((s) => s.s || s.name || "").join("");

export function generateStaticParams() { return Object.keys(slugs).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const {slug}=await params; const g=all.find(x=>x.id===slugs[slug]); return { title:g?`${g.titleCn} — 魔兽世界：无限`:"中文攻略", alternates:{canonical:`/zh/guides/${slug}`,languages:{en:`/guides/forever/${slug}`,"zh-Hans":`/zh/guides/${slug}`,"x-default":`/guides/forever/${slug}`}} }; }
export default async function ZhGuidePage({ params }: { params: Promise<{slug:string}> }) {
  const {slug}=await params; const guide=all.find(x=>x.id===slugs[slug]); if(!guide) notFound();
  return <main><div className="container-x pt-8 text-xs text-muted"><Link href="/zh/guides" className="hover:text-gold-soft">攻略</Link> / <span className="text-parchment/80">{guide.titleCn}</span></div><section className="container-x max-w-3xl pb-20 pt-8"><p className="eyebrow">{guide.groupCn} · 中文攻略</p><h1 className="display mt-2 text-3xl text-parchment md:text-5xl">{guide.titleCn}</h1><p className="mt-3 text-sm leading-relaxed text-muted">{guide.summaryCn}</p><p className="mt-2 text-[10px] text-muted/60">更新于 {guide.updateTime} · 数据来源：蓝色隐士</p><div className="prose-infinite mt-8 space-y-3 text-sm leading-relaxed text-muted">{guide.blocks.map((block,index)=>{if(block.type==="h3")return <h2 key={index} className="display mt-6 text-xl text-parchment">{block.text}</h2>;if(block.type==="p")return <p key={index}>{text(block.segs)}</p>;if(block.type==="ul"||block.type==="ol")return <ul key={index} className="list-disc space-y-1 pl-5">{(block.items||[]).map((item,i)=><li key={i}>{text(item.segs)}</li>)}</ul>;if(block.type==="table")return <div key={index} className="overflow-x-auto"><table className="w-full text-xs">{(block.rows||[]).map((row,i)=><tr key={i} className="border-t border-line/40">{row.map((cell,j)=><td key={j} className="px-2 py-1">{text(cell)}</td>)}</tr>)}</table></div>;if(block.type==="map")return <p key={index} className="text-[10px] text-muted/60">{block.cap || block.label || "地图"}</p>;return null;})}</div></section></main>;
}
