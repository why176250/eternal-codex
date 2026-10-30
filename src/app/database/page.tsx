import type { Metadata } from "next";
import Link from "next/link";
import { dungeons, items } from "@/lib/data";
import { ItemSearch } from "@/components/ItemSearch";

export const metadata: Metadata = {
  title: "Database — items, dungeons, and gearing reference",
  description:
    "Searchable item database for World of Warcraft: Forever. Filter pre-raid gear by slot and quality, and work through the dungeon ladder from Ragefire Chasm to Naxxramas.",
  alternates: { canonical: "/database", languages: { en: "/database", "zh-Hans": "/zh/database", "x-default": "/database" } },
};

export default function DatabasePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "World of Warcraft: Forever item database (seed set)",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Database</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Gear worth chasing before the first raid
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            A hand-checked seed set of pre-raid and early-raid items, with the
            source written on every entry. Stats are being verified against live
            builds — the entries below are known by name, slot, and source.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted">
            <Link
              href="/dungeons"
              className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Browse the dungeon ladder →
            </Link>
            <Link
              href="/classes"
              className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Class overviews →
            </Link>
            <Link
              href="/bis"
              className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:border-gold/40 hover:text-parchment"
            >
              BiS checklists →
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="panel p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">About this data set</p>
            <p className="mt-1">
              This is a <strong className="text-gold-soft">Classic baseline seed</strong>,
              not a live scrape. Item names, slots, and sources are drawn from the
              Classic itemization Forever is built on. Drop rates, exact stats,
              and any Forever-specific changes are being confirmed in-game and
              will be added with a build reference. We do not publish
              leaked-file data.
            </p>
          </div>

          <div className="mt-8">
            <ItemSearch items={items} />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="panel p-5">
              <p className="eyebrow">Dungeon ladder</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {dungeons.filter((d) => d.type === "Dungeon").length} dungeons and{" "}
                {dungeons.filter((d) => d.type === "Raid").length} raids, from
                Ragefire Chasm to Naxxramas, with level bands.
              </p>
              <Link
                href="/dungeons"
                className="mt-3 inline-block text-xs text-gold/90 hover:text-gold-soft"
              >
                View the ladder →
              </Link>
            </div>
            <div className="panel p-5">
              <p className="eyebrow">What&apos;s next in the database</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Quest chains, profession recipes, boss loot tables, and per-class
                pre-raid best-in-slot lists. Items get verified first — quests
                and recipes come after launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
