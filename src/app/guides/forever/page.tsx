import type { Metadata } from "next";
import Link from "next/link";
import { foreverGuides } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Forever guides — imported from Sargeras",
  description:
    "Eight full Forever guides covering classes, professions, PvP ranks, and hidden quests, imported from the Sargeras community project.",
  alternates: { canonical: "/guides/forever" },
};

export default function ForeverGuidesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Guides · Forever imports</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Eight full Forever guides
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Class quests, crafting speed gear, PvP ranks, and hidden books —
            written by the Sargeras community and imported here in full.
          </p>
          <p className="mt-3"><span className="badge">Chinese text · EN pending</span></p>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x grid gap-4 py-12 md:grid-cols-2">
          {foreverGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/forever/${guide.slug}`}
              className="panel panel-hover flex h-full flex-col p-5"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="badge">{guide.category || "Guide"}</span>
                <span className="text-muted">Sargeras</span>
              </div>
              <h2 className="display mt-4 text-xl text-parchment">
                {guide.title}
              </h2>
              <p className="mt-1 text-xs text-muted">{guide.titleEn}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                {guide.description}
              </p>
              <span className="mt-auto pt-4 text-xs text-gold/80">
                Read guide →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
