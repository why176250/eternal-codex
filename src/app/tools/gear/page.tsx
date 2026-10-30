import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Gear Hall — community loadouts",
  description:
    "Community gear loadouts for World of Warcraft: Forever. Full item sets from real players, class and spec filters, and sources. Opening after launch.",
  alternates: { canonical: "/tools/gear", languages: { en: "/tools/gear", "zh-Hans": "/zh/tools/gear", "x-default": "/tools/gear" } },
};

export default function GearHallPage() {
  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/tools", label: "Tools" },
            { href: "/tools/gear", label: "Gear Hall" },
          ]}
        />
      </div>

      <header className="container-x pb-10 pt-8">
        <p className="eyebrow">Tools / Gear Hall</p>
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
          Gear Hall
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Full gear loadouts from real players: what they wore, which
          alternatives they picked, and where the pieces came from.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
          <span className="rounded-full border border-line/80 px-3 py-1">
            Opening after launch
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            Community loadouts
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            Class + spec filters
          </span>
        </div>
      </header>

      <section className="container-x pb-20">
        <div className="panel mx-auto max-w-3xl p-6 md:p-8">
          <p className="eyebrow">No loadouts loaded yet</p>
          <h2 className="display mt-2 text-2xl text-parchment">
            The hall opens with the first verified loadouts
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We are collecting complete gear sets from players after launch.
            Each entry will show the class, spec, item icons, author, source,
            and the alternatives that were considered.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Full sets", "Every slot, not just BiS picks."],
              ["Real players", "Author and source on each entry."],
              ["Filterable", "By class, spec, and content type."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-line/70 bg-deep/40 p-4">
                <p className="text-sm text-parchment">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="mailto:corrections@eversixty.com?subject=Gear%20Hall%20loadout"
              className="text-gold/85 underline-offset-4 hover:text-gold-soft hover:underline"
            >
              Submit a loadout →
            </Link>
            <Link href="/tools" className="text-muted hover:text-parchment">
              Back to tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
