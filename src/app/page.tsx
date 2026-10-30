import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import { LaunchCountdown } from "@/components/LaunchCountdown";
import { DataUpdatingLink } from "@/components/DataUpdatingLink";
import { modules } from "@/lib/modules";
import { classNameEn, classIconPath, popularity } from "@/lib/popularity";
import { SpecTierBoard } from "@/components/SpecTierBoard";
import { LatestChangesFloat } from "@/components/LatestChangesFloat";

export default function HomePage() {
  return (
    <main>
      <LatestChangesFloat />
      <section className="container-x pb-12 pt-5 md:pt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <img
                src="/brand/eversixty-mark.svg"
                alt="Eversixty logo"
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-2xl"
              />
              <span>
                <h1 className="display block text-3xl tracking-wide text-parchment md:text-4xl">
                  Eversixty
                </h1>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.28em] text-muted">
                  A Forever companion
                </span>
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
                Six modules live
              </span>
              <span className="hidden text-muted/40 sm:inline">·</span>
              <span>No account, no paywall</span>
            </div>
          </div>

          <LaunchCountdown />
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:gap-5 md:mt-8">
          {modules.map((module) => {
            const Card = module.id === "gear" ? DataUpdatingLink : Link;
            return (
            <Card
              key={module.id}
              href={module.href}
              style={{ "--accent": module.accent } as React.CSSProperties}
              className="panel panel-hover group relative flex min-h-[104px] items-center gap-4 overflow-hidden p-4 md:p-5 2xl:min-h-[136px] 2xl:p-6"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, ${module.accent}80, transparent)`,
                }}
              />
              <span
                className="pointer-events-none absolute -right-16 -top-24 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: module.accent }}
              />

              <span className="accent-tile relative grid size-12 shrink-0 place-items-center rounded-xl border transition-colors 2xl:size-14">
                <ModuleIcon id={module.id} />
              </span>

              <span className="relative min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="display block text-lg leading-tight text-parchment md:text-xl 2xl:text-2xl">
                    {module.title}
                  </span>
                  <span className="display shrink-0 text-xs text-gold/40">
                    {module.number}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-muted 2xl:text-sm">{module.tagline}</span>
              </span>

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="relative shrink-0 text-gold/70 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Card>
            );
          })}
        </div>

        <div className="panel mt-3 flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
          <span className="eyebrow">Data</span>
          <span className="text-[11px] text-muted">
            <span className="text-parchment">589</span> pages ·{" "}
            <span className="text-parchment">23,393</span> items ·{" "}
            <span className="text-parchment">3,198</span> spells ·{" "}
            <span className="text-parchment">536</span> sets
          </span>
          <span className="flex flex-wrap items-center gap-2 text-[11px]">
            <Link href="/items" className="rounded border border-line/70 px-2 py-1 text-muted transition-colors hover:border-gold/40 hover:text-parchment">Items</Link>
            <Link href="/spells" className="rounded border border-line/70 px-2 py-1 text-muted transition-colors hover:border-gold/40 hover:text-parchment">Spells</Link>
            <Link href="/data/sets" className="rounded border border-line/70 px-2 py-1 text-muted transition-colors hover:border-gold/40 hover:text-parchment">Sets</Link>
            <Link href="/npcs" className="rounded border border-line/70 px-2 py-1 text-muted transition-colors hover:border-gold/40 hover:text-parchment">NPCs</Link>
            <Link href="/map" className="rounded border border-line/70 px-2 py-1 text-muted transition-colors hover:border-gold/40 hover:text-parchment">Map</Link>
          </span>
          <form action="/search" className="ml-auto flex w-full max-w-md items-center gap-2">
            <input
              name="q"
              placeholder="Search 33,000+ entries — items, spells, sets, NPCs…"
              className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-xs text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
            />
            <button className="rounded-lg border border-gold/35 bg-gold/[0.06] px-3 py-2 text-xs text-gold-soft">Search</button>
          </form>
        </div>

        <Link
          href="/tools/class-popularity"
          className="panel panel-hover group mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3"
        >
          <span className="min-w-0 flex-1">
            <span className="eyebrow">Class popularity</span>
            <span className="mt-0.5 block text-sm text-parchment">Launch class popularity</span>
          </span>
          <span className="flex flex-wrap items-center gap-4">
            {popularity.factions["全部"].slice(0, 3).map((entry, index) => (
              <span key={entry.classId} className="flex items-center gap-2">
                <span className="display text-[10px] text-gold/40">0{index + 1}</span>
                <img
                  src={classIconPath(entry.icon)}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 rounded border border-line/80"
                />
                <span className="text-xs text-muted">
                  {classNameEn(entry)}{" "}
                  <span className="text-gold-soft">{entry.percent.toFixed(1)}%</span>
                </span>
              </span>
            ))}
          </span>
          <span className="flex items-center gap-2 text-xs text-gold/80">
            {popularity.totalVotes.toLocaleString("en-US")} votes
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>

        <SpecTierBoard compact />

        <div className="mt-12 border-t border-line/60 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="display mt-2 text-2xl text-parchment">
                Three decisions, in order
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-xs text-gold/80 underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
            >
              All tools →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Pick a class",
                body: "Five questions, one class and race.",
                href: "/class-finder",
              },
              {
                n: "02",
                title: "Browse builds",
                body: "Start from a proven build, then make it yours.",
                href: "/tools/builds",
              },
              {
                n: "03",
                title: "Browse gear",
                body: "See what other players are wearing.",
                href: "/tools/gear",
              },
            ].map((step) => {
              const Card = step.href === "/bis" ? DataUpdatingLink : Link;
              return (
              <Card
                key={step.n}
                href={step.href}
                className="group flex items-start gap-4 rounded-xl border border-line/70 bg-deep/30 p-4 transition-colors hover:border-gold/40 hover:bg-gold/[0.03]"
              >
                <span className="display mt-0.5 text-sm text-gold/45">{step.n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-parchment">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {step.body}
                  </span>
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-gold/60 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
