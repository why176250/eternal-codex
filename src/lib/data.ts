import classesJson from "@/data/classes.json";
import itemsJson from "@/data/items.json";
import dungeonsJson from "@/data/dungeons.json";

export type WoWClass = (typeof classesJson)[number];
export type Item = (typeof itemsJson)[number];
export type Dungeon = (typeof dungeonsJson)[number];

export const classes: WoWClass[] = classesJson;
export const items: Item[] = itemsJson;
export const dungeons: Dungeon[] = dungeonsJson;

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

export function difficultyLabel(level: number): string {
  return level === 1 ? "Easy" : level === 2 ? "Moderate" : "Demanding";
}
