import type { Metadata } from "next";
import { allSpecGuides } from "@/lib/spec-guides";
import { classes } from "@/lib/data";
import races from "@/data/racials-db.json";
import { TierListMaker, type TierItem, type TierMode } from "@/components/TierListMaker";

export const metadata: Metadata = {
  title: "Tier list maker — Forever specs, classes, races",
  description:
    "Build your own World of Warcraft: Forever tier list for DPS, tanks, healers, all specs, classes, races, or race and class pairs. Drag, tap, or use keyboard shortcuts.",
  alternates: { canonical: "/tools/tier-list" },
};

type Race = { key: string; raceZh: string; raceIcon: string; classIds: number[] };
const raceEnglish: Record<string, string> = {
  human: "Human", dwarf: "Dwarf", nightelf: "Night Elf", gnome: "Gnome", "skyborne-high": "Skyborne High",
  orc: "Orc", undead: "Undead", tauren: "Tauren", troll: "Troll", "skyborne-wind": "Skyborne Wind",
};
const classByRaceId: Record<number, string> = {
  1: "warrior", 2: "paladin", 3: "hunter", 4: "rogue", 5: "priest", 7: "shaman", 8: "mage", 9: "warlock", 11: "druid",
};
const classById = new Map(classes.map((wowClass) => [wowClass.id, wowClass]));

function specItem(guide: (typeof allSpecGuides)[number]): TierItem {
  return {
    id: `spec-${guide.specId}`,
    name: `${guide.specName} ${guide.className}`,
    icon: `/talents/icons/${guide.icon}.jpg`,
    accent: classById.get(guide.classSlug)?.accent,
  };
}

const specItems = allSpecGuides.map(specItem);
const classItems: TierItem[] = classes.map((wowClass) => ({
  id: `class-${wowClass.id}`,
  name: wowClass.name,
  icon: `/classes/icons/${wowClass.id}.jpg`,
  accent: wowClass.accent,
}));
const raceItems: TierItem[] = (races as Race[]).map((race) => ({
  id: `race-${race.key}`,
  name: raceEnglish[race.key] ?? race.raceZh,
  icon: race.raceIcon,
}));
const pairItems: TierItem[] = (races as Race[]).flatMap((race) =>
  race.classIds.map((raceClassId) => {
    const classSlug = classByRaceId[raceClassId];
    const wowClass = classById.get(classSlug);
    return {
      id: `pair-${race.key}-${raceClassId}`,
      name: `${raceEnglish[race.key] ?? race.raceZh} ${wowClass?.name ?? ""}`.trim(),
      icon: wowClass ? `/classes/icons/${wowClass.id}.jpg` : race.raceIcon,
      accent: wowClass?.accent,
    };
  }),
);

const data: Record<TierMode, TierItem[]> = {
  dps: specItems.filter((_, index) => allSpecGuides[index].role === "DPS"),
  tanks: specItems.filter((_, index) => allSpecGuides[index].role === "Tank"),
  healers: specItems.filter((_, index) => allSpecGuides[index].role === "Healer"),
  specs: specItems,
  classes: classItems,
  races: raceItems,
  pairs: pairItems,
};

export default function TierListPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <p className="eyebrow">Tools · Tier list</p>
          <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">Tier list maker</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Rank specs, classes, races, or race and class pairs. Drag icons into a
            tier, tap an icon and then a tier, or use S/A/B/C/D/F shortcuts.
          </p>
        </div>
      </section>
      <section className="container-x py-8">
        <TierListMaker data={data} />
      </section>
    </main>
  );
}
