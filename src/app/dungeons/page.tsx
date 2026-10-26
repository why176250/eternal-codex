import type { Metadata } from "next";
import Link from "next/link";
import { dungeons } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dungeons & raids — the leveling ladder to Naxxramas",
  description:
    "Level bands for every dungeon and raid in World of Warcraft: Forever, from Ragefire Chasm to Naxxramas, with notes on what each one is actually for.",
  alternates: { canonical: "/dungeons" },
};

const bands = [
  { label: "1–20", hint: "Starter dungeons" },
  { label: "20–40", hint: "Mid-level wings" },
  { label: "40–55", hint: "Pre-raid climb" },
  { label: "55–60", hint: "The pre-raid wall" },
  { label: "60", hint: "Raids" },
];

export default function DungeonsPage() {
  const dungeonList = dungeons.filter((d) => d.type === "Dungeon");
  const raidList = dungeons.filter((d) => d.type === "Raid");

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Dungeons & raids</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            The ladder from Ragefire to Naxxramas
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Level bands and a one-line purpose for every dungeon and raid. Bands
            follow the Classic baseline; confirm exact requirements in-game once
            the realms open.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {bands.map((band) => (
              <span
                key={band.label}
                className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] text-muted"
              >
                <span className="text-gold-soft">{band.label}</span> · {band.hint}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">5-player</p>
              <h2 className="display mt-2 text-2xl text-parchment">Dungeons</h2>
            </div>
            <Link
              href="/database"
              className="text-sm text-gold/90 transition-colors hover:text-gold-soft"
            >
              Search loot →
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-panel text-left text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-medium">Dungeon</th>
                  <th className="px-4 py-3 font-medium">Level band</th>
                  <th className="px-4 py-3 font-medium">What it is for</th>
                </tr>
              </thead>
              <tbody>
                {dungeonList.map((dungeon) => (
                  <tr key={dungeon.id} className="border-b border-line/50 last:border-0">
                    <td className="px-4 py-3 text-parchment">{dungeon.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-line px-2 py-0.5 text-xs text-gold-soft">
                        {dungeon.band}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{dungeon.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">40-player (and 20-player)</p>
              <h2 className="display mt-2 text-2xl text-parchment">Raids</h2>
            </div>
            <span className="text-xs text-muted">Tier order, Classic baseline</span>
          </div>

          <ul className="mt-6 divide-y divide-line/60">
            {raidList.map((raid) => (
              <li key={raid.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-parchment">{raid.name}</p>
                  <p className="mt-1 text-xs text-muted">{raid.note}</p>
                </div>
                <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs text-gold-soft">
                  {raid.band}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
