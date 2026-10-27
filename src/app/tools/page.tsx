import type { Metadata } from "next";
import Link from "next/link";
import { toolItems } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Tools — talent, legacy, and BiS planners",
  description:
    "Interactive planners for World of Warcraft: Forever: talent calculator, legacy progression, and BiS checklists. Built in public.",
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
            Two progression planners in one place, plus BiS checklists. The
            talent calculator is live now; the legacy simulator joins it in the
            same block once its values can be verified.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Talent + Legacy: one block */}
            <section className="panel flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-teal">Live</span>
                <span className="badge">Legacy planned</span>
                <span className="ml-auto text-[11px] text-muted">
                  天赋 · 传承模拟
                </span>
              </div>
              <h2 className="display mt-4 text-xl text-parchment">
                Talent &amp; legacy planner
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Both character-progression simulators live here. Pick a talent
                build now; the legacy path opens in the same block when the
                numbers are confirmed.
              </p>

              <div className="mt-5 divide-y divide-line/60 border-y border-line/60">
                <Link
                  href="/tools/talents"
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
                  href="/tools/legacy"
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-parchment"
                >
                  <div>
                    <p className="text-sm text-parchment">
                      Legacy progression
                      <span className="ml-2 text-[11px] text-muted">Planned</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Point costs, breakpoints, and path comparison — not
                      published until verified.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gold/80 transition-colors group-hover:text-gold-soft">
                    Preview →
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
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">
              Why legacy is not a live simulator yet
            </p>
            <p className="mt-1">
              A calculator that ships with wrong numbers is worse than no
              calculator. The talent planner is live because its tree data can be
              checked against the imported dataset; the legacy page stays a
              preview until in-game values are confirmed. It already sits in the
              same block, so it will not move when it goes live.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
