import raw from "@/data/dungeons-fc.json";
import pins from "@/data/dungeon-map-pins.json";
import { foreverDungeons } from "@/lib/forever";

export type FcDungeon = {
  slug: string;
  name: string;
  levelMin: number | null;
  levelMax: number | null;
  location: string | null;
  bossCount: number | null;
  questCount: number | null;
  dropCount: number | null;
  bosses: string[];
  firstBossLoot?: string[];
  lootDetail?: { href: string; icon: string; name: string; type: string; quality: string }[];
  lootDetailCount?: number | null;
  lootFull: string[];
  lootCount: number | null;
  map: string | null;
  factionQuests?: { faction: string; quests: string; xp: string }[];
};

export type MapPin = { name: string; nameCn: string; npcId: number | null; x: number; y: number; display: number };
export type MapData = { image: string; width?: number; height?: number; pins?: MapPin[] };

const idBySlug: Record<string, string> = {
  "hall-of-thanes": "hot",
  "ragefire-chasm": "rfc",
  "blackfathom-deeps": "bfd",
  "excavation-site": "excavation",
  "city-of-dalaran": "cod",
  "scarlet-monastery-library": "smlib",
  "scarlet-monastery-cathedral": "smcath",
  uldaman: "uldaman",
  "sunken-temple": "st",
  "dire-maul-east": "dme",
  "dire-maul-north": "dmn",
  scholomance: "scholo",
  "alcaz-prison": "alcaz",
  "blackmaw-hold": "bh",
  "blackrock-depths": "brd",
  "dire-maul-west": "dmw",
  gnomergan: "gnomeregan",
  gnomeregan: "gnomeregan",
  "kroldok-stronghold": "kroldok",
  "lower-blackrock-spire": "lbrs",
  maraudon: "maraudon",
  "razorfen-downs": "rfd",
  "razorfen-kraul": "rfk",
  "ruins-of-lordaeron": "rol",
  "scarlet-monastery-armory": "smarm",
  "scarlet-monastery-graveyard": "smgy",
  "shadowfang-keep": "sfk",
  "shapers-terrace": "shapers",
  "stratholme-main-gate": "stratlive",
  "stratholme-service-gate": "stratud",
  "the-deadmines": "dm",
  "the-drowned-city": "dc",
  "the-stockade": "stockade",
  "upper-blackrock-spire": "ubrs",
  "wailing-caverns": "wc",
  zulfarrak: "zf",
};

const fc = (raw as { dungeons: FcDungeon[] }).dungeons;
const byId = new Map(fc.map((dungeon) => [idBySlug[dungeon.slug], dungeon]));
const pinsById = new Map(Object.entries(pins as unknown as Record<string, MapData>).map(([slug, value]) => [idBySlug[slug], value]));

export function getFcDungeon(id: string): FcDungeon | undefined {
  return byId.get(id);
}

export function getDungeonMap(id: string): MapData | undefined {
  return pinsById.get(id);
}

export function getDungeonImagePath(map: string | null): string | null {
  return map ? `/dungeons/fc/${map}` : null;
}

export const fcDungeonCount = fc.length;
export const fcLootCount = fc.reduce((sum, dungeon) => sum + (dungeon.lootCount ?? dungeon.lootFull.length), 0);

// Keep the compiler honest about the mapping above.
export const knownDungeonIds = new Set(foreverDungeons.map((dungeon) => dungeon.id));
