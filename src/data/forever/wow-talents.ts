import trees1 from "@/data/forever/talent_trees/wow_talent_trees_1.json";
import trees2 from "@/data/forever/talent_trees/wow_talent_trees_2.json";
import trees3 from "@/data/forever/talent_trees/wow_talent_trees_3.json";
import trees4 from "@/data/forever/talent_trees/wow_talent_trees_4.json";
import trees5 from "@/data/forever/talent_trees/wow_talent_trees_5.json";
import trees7 from "@/data/forever/talent_trees/wow_talent_trees_7.json";
import trees8 from "@/data/forever/talent_trees/wow_talent_trees_8.json";
import trees9 from "@/data/forever/talent_trees/wow_talent_trees_9.json";
import trees11 from "@/data/forever/talent_trees/wow_talent_trees_11.json";

type RawTalent = {
  id: number;
  tree_id: number;
  name: string;
  name_en: string;
  icon: string;
  maxRanks: number;
  tierId: number;
  colIndex: number;
  reqText?: string;
  prereqTalentId?: number | null;
  prereqRank?: number | null;
  ranks?: { textZh?: string; textEn?: string }[];
};

type RawTree = {
  tabId: number;
  name: string;
  name_en: string;
  icon: string;
  talents: RawTalent[];
};

type RawTreeFile = { trees: RawTree[] };

const classMeta: Record<
  number,
  { className: string; nameZh: string; classSlug: string }
> = {
  1: { className: "Warrior", nameZh: "战士", classSlug: "warrior" },
  2: { className: "Paladin", nameZh: "圣骑士", classSlug: "paladin" },
  3: { className: "Hunter", nameZh: "猎人", classSlug: "hunter" },
  4: { className: "Rogue", nameZh: "潜行者", classSlug: "rogue" },
  5: { className: "Priest", nameZh: "牧师", classSlug: "priest" },
  7: { className: "Shaman", nameZh: "萨满祭司", classSlug: "shaman" },
  8: { className: "Mage", nameZh: "法师", classSlug: "mage" },
  9: { className: "Warlock", nameZh: "术士", classSlug: "warlock" },
  11: { className: "Druid", nameZh: "德鲁伊", classSlug: "druid" },
};

function iconName(value: string) {
  const last = value.split("/").pop() ?? value;
  return last.replace(/\.(png|jpe?g)$/i, "");
}

function normalizeClass(classId: number, raw: RawTreeFile) {
  const meta = classMeta[classId];
  return {
    classId,
    className: meta.className,
    nameZh: meta.nameZh,
    classSlug: meta.classSlug,
    trees: raw.trees.map((tree) => ({
      tabId: tree.tabId,
      name: tree.name,
      nameEn: tree.name_en,
      icon: iconName(tree.icon),
      talents: tree.talents.map((talent) => ({
        id: talent.id,
        name: talent.name,
        nameEn: talent.name_en,
        icon: iconName(talent.icon),
        maxRanks: talent.maxRanks,
        tierId: talent.tierId,
        colIndex: talent.colIndex,
        reqText: talent.reqText ?? "",
        prereqTalentId: talent.prereqTalentId || null,
        prereqRank: talent.prereqRank || null,
        classicStatus: null,
        ranks: (talent.ranks ?? []).map((rank) => ({
          zh: rank.textZh ?? "",
          en: rank.textEn ?? "",
        })),
      })),
    })),
  };
}

export const foreverTalents = [
  normalizeClass(1, trees1 as RawTreeFile),
  normalizeClass(2, trees2 as RawTreeFile),
  normalizeClass(3, trees3 as RawTreeFile),
  normalizeClass(4, trees4 as RawTreeFile),
  normalizeClass(5, trees5 as RawTreeFile),
  normalizeClass(7, trees7 as RawTreeFile),
  normalizeClass(8, trees8 as RawTreeFile),
  normalizeClass(9, trees9 as RawTreeFile),
  normalizeClass(11, trees11 as RawTreeFile),
];

export type ForeverTalentClass = (typeof foreverTalents)[number];
