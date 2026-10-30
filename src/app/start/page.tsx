import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";

export const metadata: Metadata = {
  title: "Start here — ruleset, faction, class, and launch route",
  description:
    "The four decisions that shape launch week in World of Warcraft: Forever: ruleset, faction, class, and route. Start with the choice you cannot undo.",
  alternates: { canonical: "/start", languages: { en: "/start", "zh-Hans": "/zh/start", "x-default": "/start" } },
};

const primary = [
  "start-here-rulesets-and-realms",
  "class-picker",
  "leveling-1-20-launch-route",
  "release-day-hub",
];

const secondary = [
  "leveling-20-60-route",
  "dual-spec-at-40",
  "professions-first-week",
  "addons-launch-stack",
];

export default function StartPage() {
  const guides = primary.map((slug) => getGuide(slug)).filter(Boolean);
  const more = secondary.map((slug) => getGuide(slug)).filter(Boolean);

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-gold-soft">
              Home
            </Link>
            <span className="text-muted/40">/</span>
            <span className="text-parchment/80">Play</span>
          </div>
          <p className="eyebrow mt-6">Play · 开服规划</p>
          <h1 className="display mt-3 text-4xl text-parchment md:text-5xl">
            Start here
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Four decisions shape launch week: ruleset, faction, class, and route.
            Make the permanent choices first — everything else can be fixed later.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <Link
              href="/tools/talents"
              className="rounded-md border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Already decided? Plan talents →
            </Link>
            <Link
              href="/bis"
              className="rounded-md border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Go to gear plan →
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) =>
            guide ? <GuideCard key={guide.slug} guide={guide} /> : null,
          )}
        </div>

        <div className="mt-10">
          <p className="eyebrow">Once those are locked</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {more.map((guide) =>
              guide ? <GuideCard key={guide.slug} guide={guide} /> : null,
            )}
          </div>
        </div>

        <div className="panel mt-10 grid gap-5 p-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-teal">Before launch</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Decide ruleset + faction (cannot be changed).</li>
              <li>Install the client and check the release time for your region.</li>
              <li>Pick one gathering profession before level 5.</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gold">First hour</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Train skills every even level; do not hoard silver.</li>
              <li>Head to the level-10 meetup point with your group.</li>
              <li>Start the dungeon at the level band, not after it.</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Do not</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Do not buy gear from the auction house in week one.</li>
              <li>Do not level a crafting profession without a gatherer.</li>
              <li>Do not reroll before level 20 because of a tier list.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
