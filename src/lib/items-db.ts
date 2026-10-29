import scarlet from "@/data/scarlet-items.json";
import zug from "@/data/zug-items.json";

export type DbItem = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  qualityLabel: string;
  ilvl: number;
  itemClass: number;
  inventoryType: number;
  className: string;
  slotName: string;
  stats?: { name: string; value: number }[];
  price?: string | null;
  bind?: string | null;
  reqLevel?: number | null;
  effect?: string | null;
};

const qualityLabels: Record<number, string> = {
  0: "Poor", 1: "Common", 2: "Uncommon", 3: "Rare", 4: "Epic", 5: "Legendary",
};
const classLabels: Record<number, string> = {
  0: "Consumable", 1: "Container", 2: "Weapon", 3: "Gem", 4: "Armor", 5: "Reagent",
  6: "Projectile", 7: "Trade Goods", 8: "Recipe", 9: "Money", 10: "Quiver",
  11: "Quest", 12: "Key", 13: "Permanent", 15: "Misc",
};
const slotLabels: Record<number, string> = {
  1: "Head", 2: "Neck", 3: "Shoulder", 4: "Shirt", 5: "Chest", 6: "Waist",
  7: "Legs", 8: "Feet", 9: "Wrist", 10: "Hands", 11: "Finger", 12: "Trinket",
  13: "One-Hand", 14: "Shield", 15: "Ranged", 16: "Back", 17: "Two-Hand",
  18: "Bag", 19: "Tabard", 20: "Robe", 21: "Main Hand", 22: "Off Hand",
  23: "Holdable", 24: "Ammo", 25: "Thrown", 26: "Ranged",
};
const qualityByName: Record<string, number> = {
  poor: 0, common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5,
};

const scarletById = new Map(
  (scarlet as { id: number; icon: string; quality: number; ilvl: number; itemClass: number; inventoryType: number }[]).map((item) => [item.id, item]),
);

type ZugItem = {
  id: number;
  name: string;
  quality: string;
  type: string;
  stats?: { name: string; value: number }[];
  price?: string | null;
  bind?: string | null;
  reqLevel?: number | null;
  effect?: string | null;
};

export const dbItems: DbItem[] = (zug as ZugItem[])
  .filter((item) => /[A-Za-z]/.test(item.name))
  .map((item) => {
    const extra = scarletById.get(item.id);
    const quality = extra?.quality ?? qualityByName[item.quality] ?? 1;
    const className = extra ? classLabels[extra.itemClass] ?? "Misc" : item.type || "Misc";
    const slotName = extra ? slotLabels[extra.inventoryType] ?? "—" : "—";
    const icon = (extra?.icon || "inv_misc_questionmark.jpg").replace(/\.(png|webp)$/i, ".jpg");
    return {
      id: item.id,
      name: item.name,
      icon: `https://wow.zamimg.com/images/wow/icons/large/${icon.replace(/\.jpg$/i, "")}.jpg`,
      quality,
      qualityLabel: qualityLabels[quality] ?? "Common",
      ilvl: extra?.ilvl ?? 0,
      itemClass: extra?.itemClass ?? 0,
      inventoryType: extra?.inventoryType ?? 0,
      className,
      slotName,
      stats: item.stats ?? [],
      price: item.price ?? null,
      bind: item.bind ?? null,
      reqLevel: item.reqLevel ?? null,
      effect: item.effect ?? null,
    };
  });

export const itemClasses = Array.from(new Set(dbItems.map((i) => i.className))).sort();
export const itemSlots = Array.from(new Set(dbItems.map((i) => i.slotName))).filter(Boolean).sort();

export function getDbItem(id: string | number) {
  return dbItems.find((item) => String(item.id) === String(id));
}

export function searchItems(query: string, className = "", slot = "") {
  const q = query.trim().toLowerCase();
  return dbItems.filter((item) => {
    if (className && item.className !== className) return false;
    if (slot && item.slotName !== slot) return false;
    if (!q) return true;
    return `${item.name} ${item.className} ${item.slotName}`.toLowerCase().includes(q);
  });
}
