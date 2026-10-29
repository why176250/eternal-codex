import raw from "@/data/itemsets.json";
import names from "@/data/itemsets-names.en.json";

export type SetItem = { id: number; name: string; icon: string };
export type ItemSet = { id: number; name: string; itemCount: number; class: string; items: SetItem[] };

const nameMap = names as Record<string, string>;
const classMap: Record<string, string> = {
  "全部/通用": "All classes", 战士: "Warrior", 圣骑士: "Paladin", 猎人: "Hunter", 潜行者: "Rogue",
  牧师: "Priest", 萨满祭司: "Shaman", 法师: "Mage", 术士: "Warlock", 德鲁伊: "Druid",
};

export const itemSets = (raw as ItemSet[]).map((set) => ({
  ...set,
  name: nameMap[set.name] || set.name,
  class: classMap[set.class] || set.class,
}));

export function getItemSet(id: string | number) {
  return itemSets.find((set) => String(set.id) === String(id));
}

export function searchSets(query: string, className = "") {
  const q = query.trim().toLowerCase();
  return itemSets.filter((set) => {
    if (className && set.class !== className) return false;
    if (!q) return true;
    return `${set.name} ${set.class}`.toLowerCase().includes(q);
  });
}
