import raw from "@/data/spellbooks_full.json";

export type AbilityRank = {
  lv?: number;
  spellId?: number;
  desc?: string;
  cost?: string;
  price?: number;
};

export type ClassAbility = {
  id: number;
  name: string;
  nameEn: string;
  icon: string;
  isTalent: boolean;
  rankLabel?: string | null;
  rankNum?: number | null;
  levelReq?: number | null;
  desc?: string | null;
  cost?: string | null;
  ranks?: AbilityRank[] | null;
  trainLevels?: number[] | null;
};

export type AbilityTab = {
  name: string;
  nameEn: string;
  skills: ClassAbility[];
};

type Raw = {
  classes: {
    classId: number;
    className: string;
    spellCount: number;
    tabs: AbilityTab[];
  }[];
};

const data = raw as Raw;

const classIdBySlug: Record<string, number> = {
  warrior: 1,
  paladin: 2,
  hunter: 3,
  mage: 4,
  priest: 5,
  warlock: 6,
  rogue: 7,
  shaman: 8,
  druid: 9,
};

export function getClassAbilities(classSlug: string): AbilityTab[] {
  const classId = classIdBySlug[classSlug];
  const entry = data.classes.find((item) => item.classId === classId);
  return entry?.tabs ?? [];
}
