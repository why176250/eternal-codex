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

const classNames: Record<number, string> = {
  1: "Warrior",
  2: "Paladin",
  3: "Hunter",
  4: "Mage",
  5: "Priest",
  6: "Warlock",
  7: "Rogue",
  8: "Shaman",
  9: "Druid",
};

export function classNameEn(entry: PopularityEntry): string {
  return classNames[entry.classId] ?? entry.name;
}

export const factionLabels: Record<Faction, string> = {
  "全部": "All",
  "部落": "Horde",
  "联盟": "Alliance",
  "其他/未定": "Undecided",
};
