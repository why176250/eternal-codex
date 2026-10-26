import type { Metadata } from "next";
import Link from "next/link";
import { XpCalculator } from "@/components/XpCalculator";

export const metadata: Metadata = {
  title: "XP Calculator — kills and quests to the next level",
  description:
    "Calculate how much XP you need to level in World of Warcraft: Forever, and how many mobs, elite kills, or quests it takes. Includes rested XP and well-fed bonuses.",
  alternates: { canonical: "/tools/xp" },
};

export default function XpCalculatorPage() {
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/tools" className="hover:text-gold-soft">
          Tools
        </Link>{" "}
        / <span className="text-parchment/80">XP Calculator</span>
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="badge badge-teal">Live</span>
            <span className="text-muted">经验计算器</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            XP Calculator
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            How much XP is left, and how many kills, elite kills, or quests it
            takes to close the gap. Pick your level, enter your progress, and
            the tables recalculate.
          </p>

          <div className="mt-8">
            <XpCalculator />
          </div>

          <div className="panel mt-8 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Data note</p>
            <p className="mt-1">
              The level curve follows the Classic 1–60 table (level 35 → 36 is
              67,100 XP). Kill and quest values are the typical Classic values;
              Forever may adjust the curve, and we will recalibrate after launch.
              Quest XP is an average per level — individual quests vary.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/tools"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              All tools
            </Link>
            <Link
              href="/guides/leveling-20-60-route"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              1–60 leveling route
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
