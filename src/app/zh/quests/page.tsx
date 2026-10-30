import type { Metadata } from "next";
import Link from "next/link";
import dungeons from "@/data/quests-zh.json";
type Q={id:number;title:string;titleEn:string;level:number;min:number;side:string};
type D={slug:string;nameCn:string;nameEn:string;quests:Q[];levels:number[];isNew:boolean};
export const metadata:Metadata={title:"任务库 — 魔兽世界：无限",alternates:{canonical:"/zh/quests",languages:{en:"/quests","zh-Hans":"/zh/quests","x-default":"/quests"}}};
export default function ZhQuests(){return <main><section className="container-x py-10 md:py-14"><p className="eyebrow">任务库</p><h1 className="display mt-2 text-3xl text-parchment md:text-5xl">副本任务</h1><p className="mt-3 text-sm text-muted">按副本查看中文任务名、等级与阵营。</p></section><section className="container-x space-y-4 pb-20">{(dungeons as D[]).map(d=><div key={d.slug} className="panel p-5"><div className="flex items-center justify-between gap-2"><h2 className="display text-xl text-parchment">{d.nameCn}</h2><span className="text-[10px] text-muted">{d.levels[0]}–{d.levels[1]}</span></div><ul className="mt-2 space-y-1 text-sm text-muted">{d.quests.map(q=><li key={q.id}><Link href={`/quests/quest-${q.id}`} className="hover:text-gold-soft">{q.title}</Link> <span className="text-[10px] text-muted/60">等级 {q.level} · {q.side==="a"?"联盟":q.side==="h"?"部落":"双方"}</span></li>)}</ul></div>)}</section></main>}
