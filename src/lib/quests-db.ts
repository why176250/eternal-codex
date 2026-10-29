import raw from "@/data/quests-db.json";

export type Quest = {
  id: number;
  dungeon_name_en: string;
  title: string;
  title_zh: string;
  level: number;
  min_level: number;
  side: string;
  giver_name: string;
  giver_zone_zh: string;
};

export const quests = raw as Quest[];

export function searchQuests(query: string, side = "") {
  const q = query.trim().toLowerCase();
  return quests.filter((quest) => {
    if (side && quest.side !== side) return false;
    if (!q) return true;
    return `${quest.title} ${quest.title_zh} ${quest.giver_name} ${quest.giver_zone_zh}`.toLowerCase().includes(q);
  });
}
