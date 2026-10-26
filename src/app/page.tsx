import Link from "next/link";
import { getGuides } from "@/lib/guides";
import { classes, dungeons, items } from "@/lib/data";
import { GuideCard } from "@/components/GuideCard";
import { ClassCard } from "@/components/ClassCard";
import { qualityColors } from "@/lib/data";
import { site } from "@/lib/site";

const startHere = [
  {
    href: "/guides/start-here-rulesets-and-realms",
    kicker: "01",
    title: "Pick your ruleset and faction",
    body: "Four rulesets, faction locks, and the level-10 meetup point. Decide this before launch night.",
  },
  {
    href: "/guides/leveling-1-20-launch-route",
    kicker: "02",
    title: "The 1–20 launch route",
    body: "Starting zones by race, the level-10 handoff, and the 10–20 push that most guides skip.",
  },
  {
    href: "/guides/professions-first-week",
    kicker: "03",
    title: "Professions for week one",
    body: "One gathering, one crafting. What sells first and what your group needs before the first dungeon.",
  },
];

const featuredDungeons = [
  "molten-core",
  "upper-blackrock-spire",
  "blackrock-depths",
  "dire-maul",
  "stratholme",
  "scholomance",
];

export default function HomePage() {
  const guides = getGuides();
  const epicItems = items.filter((item) => item.quality === "Epic").slice(0, 6);
  const dungeonPreview = featuredDungeons
    .map((id) => dungeons.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="max-w-3xl">
            <p className="eyebrow">
              World of Warcraft: Forever · International realms
            </p>
            <div className="gold-rule mt-4 w-24" />
            <h1 className="display mt-6 text-4xl leading-[1.05] text-parchment md:text-6xl">
              The launch compendium
              <span className="block bg-gradient-to-r from-gold-soft via-gold to-[#b8863b] bg-clip-text text-transparent">
                for the Forever realms.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Ruleset decisions, leveling routes, class breakdowns, and a growing
              item and dungeon reference — written for players on the
              international realms, updated through the launch window.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/guides/start-here-rulesets-and-realms"
                className="rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-abyss transition-colors hover:bg-gold-soft"
              >
                Start here
              </Link>
              <Link
                href="/database"
                className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm text-parchment transition-colors hover:border-gold/50"
              >
                Browse the database
              </Link>
              <span className="flex items-center gap-2 text-xs text-muted">
                <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
                Global launch {site.launchWindow}
                <Link
                  href="/guides/release-day-hub"
                  className="text-gold/90 underline-offset-4 hover:text-gold-soft hover:underline"
                >
                  Release times →
                </Link>
              </span>
            </div>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 border-t border-line/70 pt-8 sm:grid-cols-4">
            {[
              { label: "Guides", value: guides.length },
              { label: "Classes", value: classes.length },
              { label: "Items tracked", value: items.length },
              { label: "Dungeons & raids", value: dungeons.length },
            ].map((stat) => (
              <div key={stat.label}>
                <dd className="display text-3xl text-gold-soft">{stat.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Start here */}
      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
                Three decisions that shape launch week
              </h2>
            </div>
            <Link
              href="/guides"
              className="text-sm text-gold/90 transition-colors hover:text-gold-soft"
            >
              All guides →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {startHere.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="panel panel-hover flex flex-col p-6"
              >
                <span className="display text-sm text-gold/70">{item.kicker}</span>
                <h3 className="display mt-4 text-lg text-parchment">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
                <span className="mt-auto pt-6 text-xs text-gold/80">
                  Read the guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Guides</p>
              <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
                Written for the launch window
              </h2>
            </div>
            <Link
              href="/guides"
              className="text-sm text-gold/90 transition-colors hover:text-gold-soft"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Classes</p>
              <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
                Nine classes, two specs from 40
              </h2>
            </div>
            <Link
              href="/classes"
              className="text-sm text-gold/90 transition-colors hover:text-gold-soft"
            >
              Class overview →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((wowClass) => (
              <ClassCard key={wowClass.id} wowClass={wowClass} />
            ))}
          </div>
        </div>
      </section>

      {/* Database preview */}
      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Database</p>
                <Link
                  href="/database"
                  className="text-xs text-gold/90 hover:text-gold-soft"
                >
                  Open search →
                </Link>
              </div>
              <h2 className="display mt-2 text-xl text-parchment">
                Pre-raid items worth chasing
              </h2>
              <ul className="mt-5 divide-y divide-line/60">
                {epicItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <Link
                        href={`/database/items/${item.id}`}
                        className="text-sm transition-colors hover:underline hover:underline-offset-2"
                        style={{ color: qualityColors[item.quality] }}
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        {item.slot} · {item.source} · level {item.level}
                      </p>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-muted">
                      {item.quality}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Dungeons</p>
                <Link
                  href="/dungeons"
                  className="text-xs text-gold/90 hover:text-gold-soft"
                >
                  All dungeons →
                </Link>
              </div>
              <h2 className="display mt-2 text-xl text-parchment">
                The pre-raid ladder
              </h2>
              <ul className="mt-5 space-y-3">
                {dungeonPreview.map((dungeon) =>
                  dungeon ? (
                    <li
                      key={dungeon.id}
                      className="flex items-center justify-between gap-4 border-b border-line/40 pb-3 text-sm last:border-0"
                    >
                      <span className="text-parchment/90">{dungeon.name}</span>
                      <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">
                        {dungeon.band}
                      </span>
                    </li>
                  ) : null,
                )}
              </ul>
              <Link
                href="/database"
                className="mt-6 inline-block rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-xs text-gold-soft transition-colors hover:bg-gold/10"
              >
                Search items by slot and quality
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial trust */}
      <section className="border-t border-line/60">
        <div className="container-x py-16">
          <p className="eyebrow">Editorial</p>
          <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
            What we know, and what we are still checking
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wider text-teal">
                Verified in builds
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Ruleset lineup, faction locks, launch timing, and the level-40
                dual spec. Every guide above states its own confidence level.
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wider text-gold">
                In progress
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Item stats, quest maps, and per-spec talent builds. The database
                currently ships with a Classic baseline seed set, clearly
                labelled.
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wider text-muted">
                Coming after launch
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Hardcore prep, gold routes, addon compatibility, and raid
                strategies — built from live realm data, not leaked files.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
