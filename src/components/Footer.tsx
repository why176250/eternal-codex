"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");

  const zhLabels: Record<string, string> = {
    "/guides": "指南",
    "/bis": "BiS 清单",
    "/classes": "职业",
    "/database": "数据库",
    "/dungeons": "副本",
    "/about": "关于",
  };

  return (
    <footer className="border-t border-line/80 bg-deep/60">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-lg text-parchment">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {isZh
              ? "为国际服玩家整理的开服指南与持续更新的资料库。没有付费墙，也不设门槛。"
              : "Launch-week guides and a growing reference for World of Warcraft: Forever, written for players on the international realms. No paywalls, no gatekeeping."}
          </p>
          <p className="mt-4 text-xs text-muted/80">
            {isZh
              ? `上线时间：2026 年 11 月 4 日 · 数据初始：${site.lastSeed}`
              : `Launch window: ${site.launchWindow} · Seed data: ${site.lastSeed}`}
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="eyebrow mb-3">{isZh ? "板块" : "Sections"}</p>
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-gold-soft"
                >
                  {isZh ? zhLabels[item.href] ?? item.label : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="eyebrow mb-3">{isZh ? "编辑" : "Editorial"}</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/about" className="transition-colors hover:text-gold-soft">
                {isZh ? "我们如何核实数据" : "How we verify data"}
              </Link>
            </li>
            <li>
              <Link
                href="/about#corrections"
                className="transition-colors hover:text-gold-soft"
              >
                {isZh ? "报告错误" : "Report a correction"}
              </Link>
            </li>
            <li>
              <a
                href="https://www.wowhead.com/forever"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-soft"
              >
                Wowhead Forever
              </a>
            </li>
            <li>
              <a
                href="https://www.icy-veins.com/wow-forever"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-soft"
              >
                Icy Veins Forever
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="container-x flex flex-col gap-2 py-5 text-xs leading-relaxed text-muted/70 md:flex-row md:items-center md:justify-between">
          <p>
            {isZh
              ? "本站为玩家自制的社区站点，与暴雪娱乐无隶属关系。World of Warcraft 与 Blizzard Entertainment 是暴雪娱乐的商标。"
              : "Fan-made community resource. Not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft and Blizzard Entertainment are trademarks of Blizzard Entertainment, Inc."}
          </p>
          <p>
            {isZh
              ? "由 Next.js 构建。无广告、无追踪脚本。"
              : "Built with Next.js. No ads, no tracking scripts."}
          </p>
        </div>
      </div>
    </footer>
  );
}
