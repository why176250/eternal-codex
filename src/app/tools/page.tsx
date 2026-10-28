import type { Metadata } from "next";
import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";

export const metadata: Metadata = {
  title: "Tools — talent, legacy, BiS, and XP planners",
  description:
    "Interactive planners for World of Warcraft: Forever: talent calculator, legacy progression, BiS checklists, and an exact 1–60 XP calculator.",
  alternates: { canonical: "/tools" },
};

const stats = [
  ["9", "classes"],
  ["3", "talent trees"],
  ["51", "talent points"],
  ["65", "legacy points"],
];

export default function ToolsPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Tools</p>
          <h1 className="display mt-3 max-w-3xl text-3xl text-parchment md:text-5xl">
            Plan the character before you spend the gold
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Two progression planners, BiS checklists, and an exact XP
            calculator. Each tool states its source, its assumptions, and what
            is still being verified.
          </p>
        </div>
      </section>

      <section className="container-x py-10 md:py-12">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Build planner: one block, two stages */}
          <section className="panel relative overflow-hidden p-6 lg:col-span-2 md:p-7">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-teal">Live</span>
              <span className="badge">Legacy live</span>
              <span className="ml-auto text-[11px] text-muted">天赋 · 传承模拟</span>
            </div>

            <h2 className="display mt-4 text-2xl text-parchment">
              Talent &amp; legacy planner
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              One character plan, two stages. Pick a talent build now; the
              legacy path sits in the same page and uses the same save slot.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/tools/build?tab=talent"
                className="group rounded-xl border border-line/80 bg-deep/50 p-4 transition-colors hover:border-gold/45 hover:bg-gold/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="accent-tile grid size-10 place-items-center rounded-lg border" style={{ "--accent": "#e3bd78" } as React.CSSProperties}>
                    <ModuleIcon id="talents" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-teal">Live</span>
                </div>
                <h3 className="display mt-4 text-lg text-parchment">Talent calculator</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Nine classes, three trees, prerequisites and share links.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold/85">
                  Open tool
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>

              <Link
                href="/tools/build?tab=legacy"
                className="group rounded-xl border border-line/80 bg-deep/50 p-4 transition-colors hover:border-teal/45 hover:bg-teal/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="accent-tile grid size-10 place-items-center rounded-lg border" style={{ "--accent": "#6fd5c5" } as React.CSSProperties}>
                    <ModuleIcon id="talents" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-teal">Live</span>
                </div>
                <h3 className="display mt-4 text-lg text-parchment">Legacy progression</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Three trees, 65 points, gates and milestone rewards.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold/85">
                  Open tool
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line/70 bg-line/50 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-deep/80 px-4 py-3">
                  <p className="display text-xl text-parchment">{value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/20 bg-gold/[0.03] px-4 py-3">
              <p className="text-xs leading-relaxed text-muted">
                Prerequisites, tier gates and refund cascade are enforced.
              </p>
              <Link
                href="/tools/build"
                className="inline-flex items-center gap-1.5 text-xs text-gold/90 transition-colors hover:text-gold-soft"
              >
                Open build planner
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* Right column: BiS + XP */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/bis"
              style={{ "--accent": "#9bb7ff" } as React.CSSProperties}
              className="panel panel-hover group relative flex flex-col overflow-hidden p-6"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" style={{ background: "linear-gradient(90deg, transparent, #9bb7ff80, transparent)" }} />
              <div className="flex items-start justify-between gap-3">
                <span className="accent-tile grid size-11 place-items-center rounded-xl border">
                  <ModuleIcon id="gear" />
                </span>
                <span className="badge badge-teal">Live</span>
              </div>
              <h2 className="display mt-4 text-xl text-parchment">BiS Planner</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted/70">BiS 配装</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Per-class, per-spec checklists of the upgrades worth farming
                first, with sources and farm order.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-muted/80">
                <p>· 10 classes · 2 specs average</p>
                <p>· Pre-raid and early-raid targets</p>
              </div>
              <span className="mt-auto flex items-center justify-between pt-5 text-xs text-gold/85">
                Open tool
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>

            <Link
              href="/tools/xp"
              style={{ "--accent": "#8fe0c0" } as React.CSSProperties}
              className="panel panel-hover group relative flex flex-col overflow-hidden p-6"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" style={{ background: "linear-gradient(90deg, transparent, #8fe0c080, transparent)" }} />
              <div className="flex items-start justify-between gap-3">
                <span className="accent-tile grid size-11 place-items-center rounded-xl border">
                  <ModuleIcon id="xp" />
                </span>
                <span className="badge badge-teal">Live</span>
              </div>
              <h2 className="display mt-4 text-xl text-parchment">Experience calculator</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted/70">经验计算器</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Exact 1–60 table, kills per mob level, rested XP, quest turn-ins,
                and time to 60.
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-muted/80">
                <p>· 4,084,700 XP total</p>
                <p>· Classic mob formula</p>
              </div>
              <span className="mt-auto flex items-center justify-between pt-5 text-xs text-gold/85">
                Open tool
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-parchment">How the planners behave</p>
          <p className="mt-1">
            Talent and legacy planners run on imported community datasets and
            state their source on each page. Refunds cascade so you cannot leave
            a tree in an illegal state. Legacy values can still change before
            launch — use them as a planning aid, not a promise.
          </p>
        </div>
      </section>
    </main>
  );
}
