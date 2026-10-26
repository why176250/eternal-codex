import type { Metadata } from "next";
import Link from "next/link";
import { dataItems } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Data — dungeons, items, sets, abilities, racials, vendors, pets",
  description:
    "Reference data for World of Warcraft: Forever: dungeon and raid bands, item database, sets, class abilities, racials, vendor favor, and hunter pets.",
  alternates: { canonical: "/data" },
};

export default function DataPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            The reference layer
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Every dataset the site will carry, grouped by what it answers.
            Dungeons and the item database are live; the rest are being built
            from in-game verification, not scraped tables.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataItems.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="panel panel-hover flex h-full flex-col p-5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      item.status === "live" ? "badge badge-teal" : "badge"
                    }
                  >
                    {item.status === "live" ? "Live" : "Planned"}
                  </span>
                  <span className="text-[11px] text-muted">{item.zh}</span>
                </div>
                <h2 className="display mt-4 text-lg text-parchment">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
                <span className="mt-auto pt-4 text-xs text-gold/80">
                  {item.status === "live" ? "Browse →" : "What's planned →"}
                </span>
              </Link>
            ))}
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">How we fill these in</p>
            <p className="mt-1">
              Datasets go live only when the values can be checked in the live
              game or an official build. Until then the page explains what will
              be included instead of showing placeholder numbers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
