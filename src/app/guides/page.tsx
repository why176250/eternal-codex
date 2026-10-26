import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Launch-week guides for World of Warcraft: Forever — rulesets, leveling routes, dual spec, professions, and the systems that matter on the international realms.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Guides</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Guides for launch week and beyond
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Short, decision-focused guides instead of ten-thousand-word
            everything-pages. Each one states when it was last checked and how
            confident we are in the data.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <Link
              href="/guides"
              className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-gold-soft"
            >
              All guides
            </Link>
            <Link
              href="/guides/professions"
              className="rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Profession guides
            </Link>
            <Link
              href="/guides/pvp"
              className="rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              PvP
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>

          <Link
            href="/guides/forever"
            className="panel panel-hover mt-10 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="eyebrow">Imported · Sargeras</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Eight full Forever guides: class quests, crafting speed gear,
                PvP ranks, and hidden books.
              </p>
            </div>
            <span className="shrink-0 text-xs text-gold/90">
              Read the imported guides →
            </span>
          </Link>

          <div className="panel mt-10 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Next up</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Hardcore preparation, pre-raid best-in-slot per class, addon
                compatibility, and gold routes for the first auction house
                reset. The roadmap lives on the{" "}
                <a href="/about" className="text-gold/90 hover:text-gold-soft">
                  about page
                </a>
                .
              </p>
            </div>
            <a
              href="/about#corrections"
              className="shrink-0 rounded-lg border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Report a correction
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
