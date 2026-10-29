import raw from "@/data/npcs.json";

export type Npc = {
  id: number;
  name: string;
  level: string;
  rank: string;
  type: string;
  family: string;
  icon: string | null;
};

export const npcs = raw as Npc[];

export function searchNpcs(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return npcs;
  return npcs.filter((npc) => `${npc.name} ${npc.type} ${npc.rank}`.toLowerCase().includes(q));
}
