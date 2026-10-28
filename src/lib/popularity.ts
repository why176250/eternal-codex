import raw from "@/data/scarlet/class_popularity.json";

export type PopularityEntry = {
  classId: number;
  name: string;
  icon: string;
  count: number;
  percent: number;
};

export type Faction = "全部" | "部落" | "联盟" | "其他/未定";

export const factionOrder: Faction[] = ["全部", "部落", "联盟", "其他/未定"];

export const popularity = raw as {
  title: string;
  intro: string;
  totalVotes: number;
  endTime: number;
  updatedAt: string;
  factions: Record<Faction, PopularityEntry[]>;
};

export function classIconPath(icon: string): string {
  return `/classes/icons/${icon.replace(/^class_/, "")}.jpg`;
}
