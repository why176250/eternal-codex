import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import { LaunchCountdown } from "@/components/LaunchCountdown";
import { modules } from "@/lib/modules";
import { classNameEn, classIconPath, popularity } from "@/lib/popularity";
import { SpecTierBoard } from "@/components/SpecTierBoard";

const zhModule: Record<string, { title: string; tagline: string }> = {
  talents: { title: "天赋模拟器", tagline: "天赋 + 传承" },
  gear: { title: "装备计划", tagline: "全职业 BiS" },
  classes: { title: "职业攻略", tagline: "28 篇专精攻略" },
  dungeons: { title: "副本与掉落", tagline: "等级段与掉落" },
  professions: { title: "专业", tagline: "配方与搭配" },
  xp: { title: "经验计算器", tagline: "1–60 经验" },
};

const steps = [
  { n: "01", title: "选择职业", body: "五个问题，选出适合你的职业和种族。", href: "/class-finder" },
  { n: "02", title: "浏览天赋", body: "从成熟的 build 开始，再改成自己的。", href: "/tools/builds" },
  { n: "03", title: "浏览装备", body: "看看其他玩家在穿什么。", href: "/tools/gear" },
];

export default function ZhHomePage() {
  return (
    <main>
      <section className="container-x pb-10 pt-3 md:pt-4">
        <div className="hero-banner flex flex-col gap-6 p-4 md:p-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link href="/zh" className="inline-flex items-center gap-4">
              <img src="/brand/eversixty-mark.svg" alt="Eversixty logo" width={64} height={64} className="size-16 shrink-0 rounded-2xl" />
              <span><h1 className="hero-title display block text-3xl tracking-wide md:text-4xl">Eversixty</h1><span className="mt-1 block text-[11px] uppercase tracking-[0.28em] text-muted">Forever 伴侣</span></span>
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />六大模块已上线</span><span className="hidden text-muted/40 sm:inline">·</span><span>无需账号，无付费墙</span></div>
          </div>
          <LaunchCountdown />
        </div>

        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 lg:grid-cols-3 2xl:gap-5">
          {modules.map((module) => {
            const t = zhModule[module.id] ?? { title: module.title, tagline: module.tagline };
            return <Link key={module.id} href={module.href} style={{ "--accent": module.accent } as React.CSSProperties} className="module-card panel panel-hover group relative flex min-h-[104px] items-center gap-4 overflow-hidden p-4 md:p-5 2xl:min-h-[136px] 2xl:p-6"><span className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${module.accent}80, transparent)` }} /><span className="pointer-events-none absolute -right-16 -top-24 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" style={{ background: module.accent }} /><span className="accent-tile relative grid size-12 shrink-0 place-items-center rounded-xl border transition-colors 2xl:size-14"><ModuleIcon id={module.id} /></span><span className="relative min-w-0 flex-1"><span className="flex items-baseline justify-between gap-3"><span className="display block text-lg leading-tight text-parchment md:text-xl 2xl:text-2xl">{t.title}</span><span className="display shrink-0 text-xs text-gold/40">{module.number}</span></span><span className="mt-1 block text-xs text-muted 2xl:text-sm">{t.tagline}</span></span><span className="relative shrink-0 text-gold/70 transition-transform duration-200 group-hover:translate-x-1">→</span></Link>;
          })}
        </div>

        <div className="panel mt-3 flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3"><span className="eyebrow">数据库</span><span className="text-[11px] text-muted"><span className="text-parchment">589</span> 页面 · <span className="text-parchment">23,393</span> 物品 · <span className="text-parchment">3,198</span> 法术 · <span className="text-parchment">536</span> 套装</span><span className="flex flex-wrap items-center gap-2 text-[11px]"><Link href="/items" className="rounded border border-line/70 px-2 py-1 text-muted hover:text-parchment">物品</Link><Link href="/spells" className="rounded border border-line/70 px-2 py-1 text-muted hover:text-parchment">法术</Link><Link href="/data/sets" className="rounded border border-line/70 px-2 py-1 text-muted hover:text-parchment">套装</Link><Link href="/npcs" className="rounded border border-line/70 px-2 py-1 text-muted hover:text-parchment">NPC</Link><Link href="/map" className="rounded border border-line/70 px-2 py-1 text-muted hover:text-parchment">地图</Link></span><form action="/search" className="ml-auto flex w-full max-w-md items-center gap-2"><input name="q" placeholder="搜索 33,000+ 条目 — 物品、法术、套装、NPC…" className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-xs text-parchment placeholder:text-muted/50" /><button className="rounded-lg border border-gold/35 bg-gold/[0.06] px-3 py-2 text-xs text-gold-soft">搜索</button></form></div>

        <Link href="/tools/class-popularity" className="panel panel-hover group mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3"><span className="min-w-0 flex-1"><span className="eyebrow">职业热度</span><span className="mt-0.5 block text-sm text-parchment">开服职业人气</span></span><span className="flex flex-wrap items-center gap-4">{popularity.factions["全部"].slice(0, 3).map((entry, index) => <span key={entry.classId} className="flex items-center gap-2"><span className="display text-[10px] text-gold/40">0{index + 1}</span><img src={classIconPath(entry.icon)} alt="" width={28} height={28} className="size-7 rounded border border-line/80" /><span className="text-xs text-muted">{classNameEn(entry)} <span className="text-gold-soft">{entry.percent.toFixed(1)}%</span></span></span>)}</span><span className="flex items-center gap-2 text-xs text-gold/80">{popularity.totalVotes.toLocaleString("zh-CN")} 票 <span>→</span></span></Link>

        <SpecTierBoard compact zh />

        <div className="mt-5 border-t border-line/60 pt-4">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">从这里开始</p><h2 className="display mt-2 text-2xl text-parchment">三个决定，按顺序</h2></div><Link href="/tools" className="text-xs text-gold/80 hover:text-gold-soft">全部工具 →</Link></div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">{steps.map((step) => <Link key={step.n} href={step.href} className="group flex items-start gap-4 rounded-xl border border-line/70 bg-deep/30 p-4 transition-colors hover:border-gold/40"><span className="display mt-0.5 text-sm text-gold/45">{step.n}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-parchment">{step.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted">{step.body}</span></span><span className="mt-1 text-gold/60 group-hover:translate-x-1">→</span></Link>)}</div>
        </div>
      </section>
    </main>
  );
}
