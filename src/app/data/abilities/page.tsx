import type { Metadata } from "next";
import Link from "next/link";
import { AbilitySearch } from "@/components/AbilitySearch";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Class abilities — Forever spell index",
  description:
    "Search 12,799 Forever abilities and spells by name and school. Imported from the Sargeras community dataset.",
  alternates: { canonical: "/data/abilities" },
};

export default function AbilitiesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data · Abilities</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Ability index
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            12,799 abilities from the Forever client, searchable by name and
            school. The index loads on demand so the page stays fast.
          </p>
          <p className="mt-3"><span className="badge">Names: EN pending</span></p>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x max-w-3xl py-12">
          <AbilitySearch />
          <div className="panel mt-8 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">About this data</p>
            <p className="mt-1">
              The source lists ability names and schools but not full tooltips;
              descriptions are not included yet. Duplicate and deprecated
              entries are filtered out, but the index still contains internal
              and NPC abilities.
            </p>
          </div>
          <Link
            href="/data"
            className="mt-8 inline-block text-sm text-gold/90 hover:text-gold-soft"
          >
            Back to data →
          </Link>
        </div>
      </section>
    </main>
  );
}
