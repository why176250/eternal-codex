import rawGuides from "@/data/class-guides.en.json";
import talentsJson from "@/data/forever/talents.json";

export type SpecSection = {
  key: string;
  title: string;
  markdown: string;
};

export type SpecGuide = {
  specId: number;
  specName: string;
  specNameEn: string;
  classSlug: string;
  className: string;
  role: "Tank" | "Healer" | "DPS";
  title: string;
  updatedAt: string;
  icon: string;
  sections: SpecSection[];
};

type RawGuide = {
  specId: number;
  specName: string;
  title: string;
  updatedAt: string;
  icon: string;
  sections: SpecSection[];
};

const meta: Record<
  number,
  { en: string; classSlug: string; className: string; role: SpecGuide["role"] }
> = {
  57: { en: "Arms", classSlug: "warrior", className: "Warrior", role: "DPS" },
  58: { en: "Fury", classSlug: "warrior", className: "Warrior", role: "DPS" },
  59: { en: "Protection", classSlug: "warrior", className: "Warrior", role: "Tank" },
  60: { en: "Holy", classSlug: "paladin", className: "Paladin", role: "Healer" },
  61: { en: "Protection", classSlug: "paladin", className: "Paladin", role: "Tank" },
  62: { en: "Retribution", classSlug: "paladin", className: "Paladin", role: "DPS" },
  63: { en: "Beast Mastery", classSlug: "hunter", className: "Hunter", role: "DPS" },
  64: { en: "Marksmanship", classSlug: "hunter", className: "Hunter", role: "DPS" },
  65: { en: "Survival", classSlug: "hunter", className: "Hunter", role: "DPS" },
  66: { en: "Arcane", classSlug: "mage", className: "Mage", role: "DPS" },
  67: { en: "Fire", classSlug: "mage", className: "Mage", role: "DPS" },
  68: { en: "Frost", classSlug: "mage", className: "Mage", role: "DPS" },
  69: { en: "Discipline", classSlug: "priest", className: "Priest", role: "Healer" },
  70: { en: "Holy", classSlug: "priest", className: "Priest", role: "Healer" },
  71: { en: "Shadow", classSlug: "priest", className: "Priest", role: "DPS" },
  72: { en: "Affliction", classSlug: "warlock", className: "Warlock", role: "DPS" },
  73: { en: "Demonology", classSlug: "warlock", className: "Warlock", role: "DPS" },
  74: { en: "Destruction", classSlug: "warlock", className: "Warlock", role: "DPS" },
  75: { en: "Assassination", classSlug: "rogue", className: "Rogue", role: "DPS" },
  76: { en: "Combat", classSlug: "rogue", className: "Rogue", role: "DPS" },
  77: { en: "Subtlety", classSlug: "rogue", className: "Rogue", role: "DPS" },
  78: { en: "Elemental", classSlug: "shaman", className: "Shaman", role: "DPS" },
  79: { en: "Enhancement", classSlug: "shaman", className: "Shaman", role: "DPS" },
  80: { en: "Restoration", classSlug: "shaman", className: "Shaman", role: "Healer" },
  81: { en: "Balance", classSlug: "druid", className: "Druid", role: "DPS" },
  82: { en: "Feral (Cat)", classSlug: "druid", className: "Druid", role: "DPS" },
  83: { en: "Feral (Bear)", classSlug: "druid", className: "Druid", role: "Tank" },
  84: { en: "Restoration", classSlug: "druid", className: "Druid", role: "Healer" },
};

export const allSpecGuides: SpecGuide[] = (rawGuides as RawGuide[]).map((guide) => {
  const m = meta[guide.specId] ?? {
    en: guide.specName,
    classSlug: "unknown",
    className: "Unknown",
    role: "DPS" as const,
  };
  const classTalents = talentsJson.find((entry) => entry.className === m.className);
  const treeBase = m.en.replace(/ \(.*\)$/, "");
  const tree =
    classTalents?.trees.find((item) => item.nameEn === treeBase) ??
    classTalents?.trees.find((item) => item.nameEn === m.en);
  return {
    ...guide,
    specName: m.en,
    specNameEn: m.en,
    title: `${m.en} guide`,
    icon: tree?.icon ?? "",
    classSlug: m.classSlug,
    className: m.className,
    role: m.role,
  };
});

export function getSpecGuides(classSlug: string): SpecGuide[] {
  return allSpecGuides.filter((guide) => guide.classSlug === classSlug);
}
