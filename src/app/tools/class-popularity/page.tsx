import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PopularityTabs } from "@/components/PopularityTabs";
import { popularity } from "@/lib/popularity";

export const metadata: Metadata = {
  title: "Launch class popularity",
  description:
    "Which class is the most popular pick for World of Warcraft: Forever? 41,270 votes from the launch poll, split by faction.",
  alternates: { canonical: "/tools/class-popularity" },
};

export default function ClassPopularityPage() {
  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/tools", label: "Tools" },
            { href: "/tools/class-popularity", label: "Class popularity" },
          ]}
        />
      </div>

      <header className="container-x pb-10 pt-8">
        <p className="eyebrow">Tools / Class popularity</p>
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
          首发职业热度
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          {popularity.intro}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
          <span className="rounded-full border border-line/80 px-3 py-1">
            {popularity.totalVotes.toLocaleString("en-US")} 票
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            更新于 {popularity.updatedAt}
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            投票已截止
          </span>
        </div>
      </header>

      <section className="container-x pb-20">
        <PopularityTabs
          factions={popularity.factions}
          totalVotes={popularity.totalVotes}
        />
        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">
          百分比为数据源已计算结果，页面不再重新四舍五入。阵营视图只做前端切换。
        </p>
      </section>
    </main>
  );
}
