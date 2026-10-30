import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { classes, getClass } from "@/lib/data";
import { decorateSkillMarkers } from "@/lib/skill-tooltips";
import guides from "@/data/class-guides-zh.json";

type Params = { slug: string };
const zhClass: Record<string, { name: string; specSuffix: string; tagline: string }> = {
  warrior: { name: "战士", specSuffix: "战士", tagline: "经典坦克基准：怒气、仇恨和装备成长。" },
  paladin: { name: "圣骑士", specSuffix: "圣骑士", tagline: "祝福、圣印与多面手治疗/坦克。" },
  hunter: { name: "猎人", specSuffix: "猎人", tagline: "远程物理、宠物与单刷之王。" },
  rogue: { name: "潜行者", specSuffix: "潜行者", tagline: "近战爆发、控制与潜行。" },
  priest: { name: "牧师", specSuffix: "牧师", tagline: "治疗主力与暗影输出。" },
  shaman: { name: "萨满祭司", specSuffix: "萨满祭司", tagline: "图腾、治疗与元素爆发。" },
  mage: { name: "法师", specSuffix: "法师", tagline: "传送、控制与法术输出。" },
  warlock: { name: "术士", specSuffix: "术士", tagline: "诅咒、恶魔与持续伤害。" },
  druid: { name: "德鲁伊", specSuffix: "德鲁伊", tagline: "变形、治疗与混合职责。" },
};

export function generateStaticParams(): Params[] { return classes.map((c) => ({ slug: c.id })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = zhClass[slug]; const wowClass = getClass(slug);
  if (!meta || !wowClass) return { title: "职业不存在" };
  const en = `/classes/${slug}`, zh = `/zh/classes/${slug}`;
  return { title: `${meta.name}职业攻略 — 魔兽世界：无限`, description: meta.tagline, alternates: { canonical: zh, languages: { en, "zh-Hans": zh, "x-default": en } } };
}

type Guide = { specName: string; title: string; updatedAt: string; sections: { title: string; markdown: string }[] };
export default async function ZhClassPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = zhClass[slug]; const wowClass = getClass(slug);
  if (!meta || !wowClass) notFound();
  const specs = (guides as Guide[]).filter((g) => g.specName.endsWith(meta.specSuffix));
  return (
    <main>
      <section className="container-x py-10 md:py-14">
        <p className="eyebrow">职业攻略 · 中文数据</p>
        <div className="mt-3 flex flex-wrap items-center gap-4"><h1 className="display text-4xl md:text-6xl" style={{ color: wowClass.accent }}>{meta.name}</h1><img src={`/classes/icons/${slug}.jpg`} alt="" width={64} height={64} className="size-14 rounded-xl border object-cover" /></div>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{meta.tagline}</p>
        <p className="mt-2 text-[11px] text-muted/60">数据来源：蓝色隐士 · {specs.length} 个专精</p>
      </section>
      <section className="container-x max-w-4xl pb-20">
        {specs.map((spec) => <article key={spec.title} className="panel mb-4 p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="display text-2xl text-parchment">{spec.specName}</h2><span className="text-[10px] text-muted">更新于 {spec.updatedAt}</span></div>{spec.sections.map((section) => <details key={section.title} className="mt-3 border-t border-line/50 pt-3" open={section.title === "概述"}><summary className="cursor-pointer text-sm text-gold-soft">{section.title}</summary><div className="prose-infinite mt-3 text-sm" dangerouslySetInnerHTML={{ __html: decorateSkillMarkers(marked.parse(section.markdown, { async: false }) as string) }} /></details>)}</article>)}
        <Link href="/zh/classes" className="text-sm text-gold/80">← 返回职业列表</Link>
      </section>
    </main>
  );
}
