import raw from "@/data/professions.json";
import itemNames from "@/data/item-names.en.json";
import professionNames from "@/data/profession-names.en.json";

export type ProfessionItem = {
  id: number;
  name: string;
  icon: string;
  itemLevel: number;
  quality: number;
  kind: "crafted" | "reagent";
};

type Recipe = {
  itemId?: number;
  localesName?: string;
  icon?: string;
  itemLevel?: number;
  quality?: number;
  reagents?: { itemId?: number; nameCn?: string; icon?: string }[];
};

const data = raw as unknown as { recipes: Recipe[] };
const map = new Map<number, ProfessionItem>();

function english(zh: string | undefined): string {
  if (!zh) return "Unknown item";
  return String(professionNames[zh as keyof typeof professionNames] ?? zh).replace(/\s+/g, " ").trim();
}

for (const recipe of data.recipes) {
  if (recipe.itemId) {
    const id = recipe.itemId;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: itemNames[String(id) as keyof typeof itemNames] ?? english(recipe.localesName),
        icon: `/professions/icons/${recipe.icon ?? "inv_misc_questionmark.jpg"}`,
        itemLevel: recipe.itemLevel ?? 0,
        quality: recipe.quality ?? 1,
        kind: "crafted",
      });
    }
  }
  for (const reagent of recipe.reagents ?? []) {
    if (!reagent.itemId || map.has(reagent.itemId)) continue;
    const id = reagent.itemId;
    map.set(id, {
      id,
      name: itemNames[String(id) as keyof typeof itemNames] ?? english(reagent.nameCn),
      icon: `/professions/icons/${reagent.icon ?? "inv_misc_questionmark.jpg"}`,
      itemLevel: 0,
      quality: 1,
      kind: "reagent",
    });
  }
}

export const professionItems = Array.from(map.values());

export function getProfessionItem(id: string | number) {
  return map.get(Number(id));
}
