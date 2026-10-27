import type { Metadata } from "next";
import Link from "next/link";
import { XpCalculator } from "@/components/XpCalculator";

export const metadata: Metadata = {
  title: "Experience calculator — XP to 60 and kills per level",
  description:
    "Classic/Forever XP calculator: exact 1–60 table, remaining XP, kills per mob level, elites, rested mob XP, quest turn-ins, and time estimates.",
  alternates: { canonical: "/tools/xp" },
};

export default function XpPage() {
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/tools" className="hover:text-gold-soft">
          Tools
        </Link>{" "}
        / <span className="text-parchment/80">Experience Calculator</span>
      </div>

      <section className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 md:px-8">
        <div className="flex items-center gap-2 text-xs">
          <span className="badge badge-teal">Live</span>
          <span className="text-muted">经验计算器</span>
        </div>
        <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
          Experience calculator
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Exact Classic 1–60 XP table, remaining XP at your current level, kills
          per mob level, and time estimates. Total from 1 to 60:{" "}
          <span className="text-parchment">4,084,700 XP</span>.
        </p>

        <div className="mt-8">
          <XpCalculator />
        </div>

        <div className="mt-8 space-y-2 text-xs leading-relaxed text-muted/70">
          <p>
            XP table: Classic/Forever values, 4,084,700 total from 1 to 60. Mob
            XP uses the Classic formula with the player-level base and the
            zero-difference table; grey mobs return 0.
          </p>
          <p>
            Quest XP is hand-tuned in Classic, so the quest count uses the value
            you enter rather than a guessed formula. Rested doubles mob XP but
            the pool is not modelled.
          </p>
          <p>
            Leveling decisions are covered in the{" "}
            <Link href="/guides/leveling-1-20-launch-route" className="text-gold/90 hover:text-gold-soft">
              1–20 route
            </Link>{" "}
            and{" "}
            <Link href="/guides/leveling-20-60-route" className="text-gold/90 hover:text-gold-soft">
              20–60 guide
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
