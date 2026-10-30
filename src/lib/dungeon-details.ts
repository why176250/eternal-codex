import raw from "@/data/dungeon-details.json";
import directory from "@/data/dungeon-list-directory.json";
import reveal from "@/data/dungeon-list-reveal.json";
import dimensions from "@/data/dungeon-map-dimensions.json";
import { fcSlugById, resolveFcSlug } from "@/lib/dungeon-fc";

export type DetailItem = { name: string; quality: string; type: string; href: string; icon: string };
export type DetailSection = {
  kind: "boss" | "container" | "trash";
  name: string;
  levelText?: string;
  portrait?: string;
  order: number;
  sectionId: string;
  items: DetailItem[];
};
export type DetailRow = { key: string; text: string; lines?: string[]; links?: { text: string; href: string }[] };
export type DetailQuest = {
  id: string;
  name: string;
  href: string;
  levelLine: string;
  text: string;
  objectives: { key: string; value: string; links?: { text: string; href: string }[] }[];
  rewards?: { label: string; items: DetailItem[] };
};
export type DungeonDetail = {
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  heroLines: { text: string; primaryLink?: { text: string; href: string } | null }[];
  extraHeroLink?: { text: string; href: string };
  bossAvatars: { name: string; href: string; portrait: string }[];
  chapters: { label: string; count: string; href: string; icon: string }[];
  loot: { heading: string; countLabel: string; intro: string };
  sections: DetailSection[];
  before?: { heading: string; sub: string; intro: string; rows: DetailRow[] };
  quests?: {
    heading: string; sub: string; intro: string;
    xpTable: { faction: string; quests: string; experienceBeta: string; inClassic: string; worth: string }[];
    xpNote: string;
    groups: { faction: string; count: string; quests: DetailQuest[] }[];
  };
  questItems?: { heading: string; sub: string; intro: string; columns: string[]; rows: { cells: { text: string; links?: { text: string; href: string }[]; icon?: string; side?: string }[] }[] };
  questGivers?: { heading: string; sub: string; intro: string; columns: string[]; rows: { cells: { text: string; links?: { text: string; href: string }[]; icon?: string; side?: string }[] }[] };
  mapAsset?: { url: string; width: number; height: number; name: string; credit: string };
};

const details = raw as unknown as Record<string, DungeonDetail>;
const directoryData = directory as unknown as { dungeons: Record<string, { name: string; levelBand: string; bosses: number | null; rareSpawns: number | null; items: number | null; noBossNamedYet: boolean; statRaw: string }> };
const revealData = reveal as unknown as { dungeons: Record<string, { bossLootCount: number | null; questRewardsCount: number | null }> };
const dimensionData = dimensions as unknown as { dungeons: Record<string, { width: number; height: number; aspectRatio: string }> };

export function getDungeonDetail(param: string): { detail: DungeonDetail; slug: string } | undefined {
  const slug = resolveFcSlug(param);
  if (!slug) return undefined;
  const detail = details[slug];
  return detail ? { detail, slug } : undefined;
}

export function getCanonicalSlug(id: string): string | undefined {
  return fcSlugById[id];
}

export function getDungeonDirectory(slug: string) {
  return directoryData.dungeons[slug];
}

export function getDungeonReveal(slug: string) {
  return revealData.dungeons[slug];
}

export function getMapDimensions(slug: string) {
  return dimensionData.dungeons[slug];
}

export const directoryBossTotal = Object.values(directoryData.dungeons).reduce((sum, entry) => sum + (entry.bosses ?? 0), 0);

export function getDetailBossCards(detail: DungeonDetail) {
  return [...detail.sections].sort((a, b) => a.order - b.order);
}

export function uniqueBossLoot(detail: DungeonDetail) {
  const map = new Map<string, DetailItem>();
  for (const section of detail.sections) {
    if (section.kind !== "boss") continue;
    for (const item of section.items) {
      const key = `${item.href || item.name}`;
      if (!map.has(key)) map.set(key, item);
    }
  }
  return [...map.values()];
}
