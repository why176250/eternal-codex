import type { Metadata } from "next";
import Link from "next/link";
import { foreverRacials } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Racial abilities — all ten races",
  description:
    "Racial abilities for every Forever race, including the new Skyborn races, with cooldowns and effect text.",
  alternates: { canonical: "/data/racials" },
};

export default function RacialsPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data · Racials</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Racial abilities
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Ten races, active and passive racials, including the two Skyborn
            options added in Forever. English ability text is a translation of
            the source until it is verified in-game.
          </p>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x grid gap-5 py-12 md:grid-cols-2">
          {foreverRacials.map((race) => (
            <article key={race.key} className="panel p-5">
              <div className="flex items-center gap-3">
                {race.raceIcon ? (
                  <img
                    src={race.raceIcon}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-md border border-line"
                  />
                ) : null}
                <div>
                  <h2 className="display text-xl text-parchment">{race.raceEn}</h2>
                  <p className="text-xs text-muted">{race.raceZh} · {race.factionEn}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-4">
                {race.abilities.map((ability) => (
                  <li key={`${ability.sid}-${ability.name}`} className="border-t border-line/50 pt-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-parchment">{ability.nameEn}</span>
                      <span className="ml-2 text-[11px] text-muted">{ability.name}</span>
                      <span className={ability.type === "active" ? "badge" : "badge badge-teal"}>
                        {ability.type}
                      </span>
                    </div>
                    {ability.infoEn ? (
                      <p className="mt-1 text-[11px] text-muted">{ability.infoEn}</p>
                    ) : null}
                    {ability.descEn ? (
                      <p className="mt-1 leading-relaxed text-muted">{ability.descEn}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="container-x pb-12">
        <Link href="/data" className="text-sm text-gold/90 hover:text-gold-soft">
          Back to data →
        </Link>
      </div>
    </main>
  );
}
