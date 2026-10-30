import type { Metadata } from "next";
import { races } from "@/lib/races-db";

export const metadata: Metadata = {
  title: "Races — Forever racial abilities",
  description: "All ten Forever races, their factions, and active/passive racial abilities.",
  alternates: { canonical: "/races" },
};

const raceEnglish: Record<string, string> = {
  human: "Human", dwarf: "Dwarf", "night-elf": "Night Elf", gnome: "Gnome", draenei: "Draenei",
  orc: "Orc", undead: "Undead", tauren: "Tauren", troll: "Troll", "blood-elf": "Blood Elf",
};

export default function RacesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · Races</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Races</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Ten races across both factions, with their active and passive racials.
            Class availability and racial tuning can change in Forever; verify in
            the character-creation screen.
          </p>
        </div>
      </section>
      <section className="container-x grid gap-4 py-10 md:grid-cols-2">
        {races.map((race) => (
          <article key={race.key} className="panel p-5">
            <div className="flex items-start gap-3">
              <img src={race.raceIcon} alt="" width={48} height={48} className="size-12 rounded-lg border border-line/80" />
              <div>
                <h2 className="display text-xl text-parchment">{raceEnglish[race.key] ?? race.raceZh}</h2>
                <p className="mt-0.5 text-[11px] text-muted">{race.faction} · {race.raceZh}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {race.abilities.map((ability) => (
                <div key={ability.name} className="flex gap-2 border-t border-line/40 pt-2 first:border-0 first:pt-0">
                  <img src={ability.icon} alt="" width={28} height={28} className="size-7 shrink-0 rounded border border-line/70" />
                  <div>
                    <p className="text-xs text-parchment">{ability.name} <span className="text-[10px] text-muted/70">{ability.type}</span></p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{ability.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
