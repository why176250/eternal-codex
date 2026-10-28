import type { Metadata } from "next";
import Link from "next/link";
import { foreverGuides } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Eight full World of Warcraft: Forever guides: class quests, crafting speed gear, PvP ranks, hidden books, and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Guides</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Eight full Forever guides
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Class quests, crafting speed gear, PvP ranks, hidden books, and
            more. Imported from the Sargeras community project and translated
            into English.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">
              {foreverGuides.length} guides
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              Imported · Sargeras
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              Images localized
            </span>
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="display mt-4 text-xl leading-snug text-parchment">
                {guide.title}
              </h2>
              <p className="mt-1 text-[11px] text-muted/70">{guide.subtitle}</p>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">
                {guide.description}
              </p>
              <span className="mt-auto pt-4 text-xs text-gold/85">
                Read guide →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <ForeverSourceNote />
        </div>
      </section>
    </main>
  );
}
