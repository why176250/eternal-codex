import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/guides";
import { classes, dungeons, items } from "@/lib/data";

export const metadata: Metadata = {
  title: "魔兽世界：无限（Forever）攻略与数据库",
  description:
    "面向《魔兽世界：无限》国际服玩家的开服指南、职业与专精 BiS 清单、副本等级表，以及可搜索的装备数据库。",
  alternates: {
    canonical: "/zh",
    languages: { en: "/", "zh-Hans": "/zh", "x-default": "/" },
  },
};

const entryCards = [
  {
    href: "/guides/start-here-rulesets-and-realms",
    tag: "开服",
    title: "规则集与开服时间",
    body: "PVE / PVP / RP / RP-PvP 怎么选，阵营和集合点怎么定。",
  },
  {
    href: "/guides/leveling-20-60-route",
    tag: "升级",
    title: "1–60 升级路线",
    body: "按等级段和阵营拆的路线，附副本节点和开服周的坑。",
  },
  {
    href: "/guides/class-picker",
    tag: "职业",
    title: "职业选择",
    body: "九个职业横向对比：升级速度、组队需求、装备竞争。",
  },
  {
    href: "/bis",
    tag: "BiS",
    title: "BiS 清单",
    body: "9 职业、17 个专精的优先刷取目标，含来源和刷取顺序。",
  },
  {
    href: "/database",
    tag: "数据库",
    title: "装备数据库",
    body: "按名称、部位、品质、阶段筛选，每件装备可查来源。",
  },
  {
    href: "/dungeons",
    tag: "副本",
    title: "副本阶梯",
    body: "26 个副本和团本的等级段、用途与已验证掉落。",
  },
];

export default function ZhHomePage() {
  const guides = getGuides();

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container-x pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="max-w-3xl">
            <p className="eyebrow">World of Warcraft: Forever · 国际服</p>
            <div className="gold-rule mt-4 w-24" />
            <h1 className="display mt-6 text-4xl leading-[1.08] text-parchment md:text-6xl">
              开服之前，
              <span className="block bg-gradient-to-r from-gold-soft via-gold to-[#b8863b] bg-clip-text text-transparent">
                先把这几件事想清楚。
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              规则集怎么选、1–60 怎么走、40 级双专精怎么配、第一周刷什么装备——中文首页先给你入口，深度内容会逐步翻译。
            </p>

            <div className="mt-6 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-gold-soft/90">
              中文版正在建设中：目前提供中文首页与导航，指南和数据库正文暂为英文。
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/guides/start-here-rulesets-and-realms"
                className="rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-abyss transition-colors hover:bg-gold-soft"
              >
                从规则集开始（英文）
              </Link>
              <Link
                href="/bis"
                className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm text-parchment transition-colors hover:border-gold/50"
              >
                BiS 清单（英文）
              </Link>
            </div>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 border-t border-line/70 pt-8 sm:grid-cols-4">
            {[
              { label: "指南", value: guides.length },
              { label: "职业", value: classes.length },
              { label: "装备", value: items.length },
              { label: "副本与团本", value: dungeons.length },
            ].map((stat) => (
              <div key={stat.label}>
                <dd className="display text-3xl text-gold-soft">{stat.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">入口</p>
              <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
                六块内容，按优先级排
              </h2>
            </div>
            <span className="text-xs text-muted">标注「英文」的页面正文暂为英文</span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entryCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="panel panel-hover flex h-full flex-col p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="badge">{card.tag}</span>
                  <span className="text-[11px] text-muted">英文</span>
                </div>
                <h3 className="display mt-4 text-lg text-parchment">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
                <span className="mt-auto pt-4 text-xs text-gold/80">
                  打开英文页 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <p className="eyebrow">阅读方式</p>
          <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
            每一页都标了可信度
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wider text-teal">已在版本内核实</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                规则集阵容、阵营限制、上线时间、40 级双专精。
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wider text-gold">社区追踪</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                来自测试服报道与社区实测，足够拿来规划，但官方仍可能调整。
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wider text-muted">经典基线</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                沿用 60 级经典版本的结构与名称；具体数值开服后核对。
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-muted">
            英文版页面为完整内容，中文版会按指南 → 数据库 → 职业页的顺序翻译。错漏请到{" "}
            <Link href="/about#corrections" className="text-gold/90 hover:text-gold-soft">
              纠错页
            </Link>
            {" "}反馈。
          </p>
        </div>
      </section>
    </main>
  );
}
