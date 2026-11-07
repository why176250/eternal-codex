import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PopularityTabs } from "@/components/PopularityTabs";
import { popularity } from "@/lib/popularity";

export const metadata: Metadata = {
  title: "Launch poll — final snapshot",
  description:
    "Final snapshot of the 41,270-vote launch class poll for World of Warcraft: Forever.",
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
        <p className="eyebrow">Tools / Historical snapshot</p>
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
          Launch poll — final snapshot
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
        <div className="mb-5 rounded-lg border border-gold/25 bg-gold/[0.04] p-4 text-sm leading-relaxed text-muted">This poll is a historical snapshot from before launch. For live character counts by class, open <Link href="/tools/class-population" className="text-gold-soft underline underline-offset-2">Class population →</Link>.</div>
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
