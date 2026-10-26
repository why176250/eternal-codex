import classesJson from "@/data/classes.json";
import itemsJson from "@/data/items.json";
import dungeonsJson from "@/data/dungeons.json";
import {
  bisClasses,
  getBisClass,
  getBisRefsForItem,
} from "@/data/bis";

export type WoWClass = (typeof classesJson)[number];
export type Item = (typeof itemsJson)[number];
export type Dungeon = (typeof dungeonsJson)[number];
export type { BisClass, BisPick, BisSpec } from "@/data/bis";

export const classes: WoWClass[] = classesJson;
export const items: Item[] = itemsJson;
export const dungeons: Dungeon[] = dungeonsJson;
export { bisClasses, getBisClass, getBisRefsForItem };

export const phases = ["Pre-raid", "MC", "BWL", "AQ", "Naxx"] as const;

export const qualityColors: Record<string, string> = {
  Legendary: "#ff8000",
  Epic: "#a335ee",
  Rare: "#0070dd",
  Uncommon: "#1eff00",
  Common: "#ffffff",
};

export function getClass(id: string): WoWClass | undefined {
  return classes.find((c) => c.id === id);
}

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function getDungeon(id: string): Dungeon | undefined {
  return dungeons.find((d) => d.id === id);
}

export function getItemsBySource(source: string): Item[] {
  return items.filter((item) => item.source === source);
}

export function difficultyLabel(level: number): string {
  return level === 1 ? "Easy" : level === 2 ? "Moderate" : "Demanding";
}
