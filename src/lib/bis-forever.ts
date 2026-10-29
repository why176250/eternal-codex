import raw from "@/data/bis-forever.json";

export type ForeverBisSlot = { slot: string; item: string; note?: string };
export type ForeverBisList = {
  slug: string;
  class: string;
  spec: string;
  mode: string;
  level: number;
  slots: ForeverBisSlot[];
};

const data = raw as { total: number; lists: ForeverBisList[] };
export const foreverBisLists = data.lists;
export const foreverBisLevels = Array.from(new Set(data.lists.map((list) => list.level))).sort((a, b) => a - b);
export const foreverBisModes = Array.from(new Set(data.lists.map((list) => list.mode))).sort();
export const foreverBisClasses = Array.from(new Set(data.lists.map((list) => list.class))).sort();

export function getForeverBis(slug: string) {
  return data.lists.find((list) => list.slug === slug);
}
