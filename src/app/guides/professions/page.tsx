import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";

export const metadata: Metadata = {
  title: "Profession guides — leveling, pairing, and gold",
  description:
    "Profession guides for World of Warcraft: Forever: which pairings to level first, what sells in week one, and how to avoid wasting gold.",
  alternates: { canonical: "/guides/professions", languages: { en: "/guides/professions", "zh-Hans": "/zh/guides/professions", "x-default": "/guides/professions" } },
};

export default function ProfessionGuidesPage() {
  const guides = getGuides().filter((guide) => guide.category === "Professions");

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href="/guides" className="text-muted hover:text-gold-soft">
              Guides
            </Link>
            <span className="text-muted/40">/</span>
            <span className="text-parchment/80">Professions</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            Profession guides
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            One gathering profession, one crafting profession, and a plan for
            what sells before anyone has gold. The recipe database is still
            being built; these guides cover the decisions.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Recipe data is coming</p>
            <p className="mt-1">
              The{" "}
              <Link href="/data/professions" className="text-gold/90 hover:text-gold-soft">
                profession data page
              </Link>{" "}
              will list recipes, trainers, and material costs once the values are
              verified in-game. Until then, treat the guides as the planning
              layer, not the price sheet.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
