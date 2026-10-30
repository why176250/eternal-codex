import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PopularityTabs } from "@/components/PopularityTabs";
import { popularity } from "@/lib/popularity";

export const metadata: Metadata = {
  title: "Launch class popularity",
  description:
    "Which class is the most popular pick for World of Warcraft: Forever? 41,270 votes from the launch poll, split by faction.",
  alternates: { canonical: "/tools/class-popularity", languages: { en: "/tools/class-popularity", "zh-Hans": "/zh/tools/class-popularity", "x-default": "/tools/class-popularity" } },
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
          Launch class popularity
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          A launch-intent poll for World of Warcraft: Forever. One vote per
          player; results were shown after voting. The poll closed at launch.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
          <span className="rounded-full border border-line/80 px-3 py-1">
            {popularity.totalVotes.toLocaleString("en-US")} votes
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            Updated {popularity.updatedAt}
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            Poll closed
          </span>
        </div>
      </header>

      <section className="container-x pb-20">
        <PopularityTabs
          factions={popularity.factions}
          totalVotes={popularity.totalVotes}
        />
        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">
          Percentages are calculated by the source; this page does not re-round them. Faction views are client-side tabs over the same static data.
        </p>
      </section>
    </main>
  );
}
