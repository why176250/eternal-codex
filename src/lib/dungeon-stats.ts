import raw from "@/data/dungeons-foreverchanges.json";

type ParsedDungeon = {
  slug: string;
  name: string;
  levelMin: number | null;
  levelMax: number | null;
  location: string | null;
  bossCount: number | null;
  questCount: number | null;
};

const idBySlug: Record<string, string> = {
  "blackfathom-deeps": "bfd",
  "city-of-dalaran": "cod",
  "dire-maul-east": "dme",
  "dire-maul-north": "dmn",
  "excavation-site": "excavation",
  "hall-of-thanes": "hot",
  "ragefire-chasm": "rfc",
  "scarlet-monastery-cathedral": "smcath",
  "scarlet-monastery-library": "smlib",
  scholomance: "scholo",
  "sunken-temple": "st",
  uldaman: "uldaman",
};

const stats = new Map(
  (raw as { dungeons: ParsedDungeon[] }).dungeons
    .filter((dungeon) => dungeon.bossCount !== null || dungeon.questCount !== null)
    .map((dungeon) => [idBySlug[dungeon.slug], dungeon]),
);

export function getDungeonStats(id: string) {
  return stats.get(id);
}
