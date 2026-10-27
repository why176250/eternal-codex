import type { Metadata } from "next";
import Link from "next/link";
import { toolItems } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Tools — talent, legacy, BiS, and XP planners",
  description:
    "Interactive planners for World of Warcraft: Forever: talent calculator, legacy progression, BiS checklists, and an exact 1–60 XP calculator.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  const bis = toolItems.find((tool) => tool.slug === "bis");

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Tools</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Plan the character before you spend the gold
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Two progression planners in one block, plus BiS checklists and an
            exact 1–60 XP calculator. All four are live; each page states its
            source and assumptions.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Talent + Legacy: one block */}
            <section className="panel flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-teal">Live</span>
                <span className="badge badge-teal">Legacy live</span>
                <span className="ml-auto text-[11px] text-muted">
                  天赋 · 传承模拟
                </span>
              </div>
              <h2 className="display mt-4 text-xl text-parchment">
                Talent &amp; legacy planner
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Both character-progression simulators live here: talent builds
                and the legacy tree. Plan either one without leaving the block.
              </p>

              <div className="mt-5 divide-y divide-line/60 border-y border-line/60">
                <Link
                  href="/tools/build?tab=talent"
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-parchment"
                >
                  <div>
                    <p className="text-sm text-parchment">
                      Talent calculator
                      <span className="ml-2 text-[11px] text-teal">Live</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Nine classes, three trees, prerequisites and share links.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gold/80 transition-colors group-hover:text-gold-soft">
                    Open →
                  </span>
                </Link>

                <Link
                  href="/tools/build?tab=legacy"
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-parchment"
                >
                  <div>
                    <p className="text-sm text-parchment">
                      Legacy progression
                      <span className="ml-2 text-[11px] text-teal">Live</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Three trees, 65 points, gates and milestone rewards.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gold/80 transition-colors group-hover:text-gold-soft">
                    Open →
                  </span>
                </Link>
              </div>

              <span className="mt-auto pt-5 text-xs text-muted">
                One block, two stages of the same character plan.
              </span>
            </section>

            {/* BiS */}
            {bis ? (
              <Link
                href={bis.href}
                className="panel panel-hover flex h-full flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="badge badge-teal">Live</span>
                  <span className="text-[11px] text-muted">{bis.zh}</span>
                </div>
                <h2 className="display mt-4 text-xl text-parchment">
                  {bis.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {bis.summary}
                </p>
                <span className="mt-auto pt-5 text-xs text-gold/80">
                  Open tool →
                </span>
              </Link>
            ) : null}

            <Link
              href="/tools/xp"
              className="panel panel-hover flex h-full flex-col p-6"
            >
              <div className="flex items-center justify-between">
                <span className="badge badge-teal">Live</span>
                <span className="text-[11px] text-muted">经验计算器</span>
              </div>
              <h2 className="display mt-4 text-xl text-parchment">
                Experience calculator
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Exact 1–60 table, remaining XP, kills per mob level, rested XP,
                quest turn-ins, and time to 60.
              </p>
              <span className="mt-auto pt-5 text-xs text-gold/80">
                Open tool →
              </span>
            </Link>
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">
              How the legacy planner behaves
            </p>
            <p className="mt-1">
              Both planners now run on imported community datasets and state
              their source. Legacy values can still change before launch — the
              page is a planning aid, not a promise. Refunds cascade so you
              cannot leave a tree in an illegal state.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
