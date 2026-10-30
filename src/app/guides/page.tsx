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

function updatedLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

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
              Updated {updatedLabel("2026-10-28")}
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
              className="panel panel-hover flex h-full flex-col overflow-hidden"
            >
              <div className="relative h-28 overflow-hidden border-b border-line/60 bg-gradient-to-br from-gold/[0.12] via-deep to-abyss">
                <img
                  src={`/talents/icons/${guide.icon}.jpg`}
                  alt=""
                  width={96}
                  height={96}
                  className="absolute right-3 top-1/2 size-20 -translate-y-1/2 rotate-3 rounded-lg border border-line/50 object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/70 to-transparent" />
                <span className="badge absolute bottom-4 left-4">{guide.category || "Guide"}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="display text-xl leading-snug text-parchment">
                  {guide.title}
                </h2>
                <p className="mt-1 text-[11px] text-muted/70">{guide.subtitle}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {guide.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-[11px] text-muted/70">
                  <span>Updated {updatedLabel(guide.updated)}</span>
                  <span className="text-gold/85">Read guide →</span>
                </div>
              </div>
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
