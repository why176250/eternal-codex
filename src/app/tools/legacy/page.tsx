import type { Metadata } from "next";
import Link from "next/link";
import { LegacyPlanner } from "@/components/LegacyPlanner";
import { foreverLegacy } from "@/lib/forever";

export const metadata: Metadata = {
  title: "Legacy planner — 3 trees, 65 points",
  description:
    "Plan the Forever legacy progression: three trees, point gates, rank text, and the 15/25/40/55 reward track. Imported from the Blue Hermit community dataset.",
  alternates: { canonical: "/tools/legacy" },
};

export default function LegacyPage() {
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/tools" className="hover:text-gold-soft">
          Tools
        </Link>{" "}
        / <span className="text-parchment/80">Legacy Planner</span>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-8 md:px-8">
        <div className="flex items-center gap-2 text-xs">
          <span className="badge badge-teal">Live</span>
          <span className="text-muted">传承模拟</span>
        </div>
        <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
          Legacy planner
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Three trees, {foreverLegacy.totalPoints} points earnable from{" "}
          {foreverLegacy.achievementCount} achievements. Spend points, respect
          each node&apos;s gate, and see which track reward comes next.
        </p>

        <div className="mt-8">
          <LegacyPlanner data={foreverLegacy} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted/70">
          Legacy data: Blue Hermit (蓝色隐士) community dataset, imported for
          personal, non-commercial reference. Point values and ranks can change
          before launch — verify in-game.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted/70">
          Tree icons are served locally from the same dataset. Tree background
          art © Blizzard Entertainment, reused from the talent calculator
          backgrounds on this non-commercial fan site.
        </p>
      </section>
    </main>
  );
}
