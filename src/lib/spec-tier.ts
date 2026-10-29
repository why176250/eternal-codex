import raw from "@/data/spec-tier-list.json";

export type SpecTierRole = "dps" | "tank" | "healer";
export type SpecTier = "S" | "A" | "B" | "C";
export type SpecTierItem = {
  specId: number;
  name: string;
  nameEn: string;
  tier: SpecTier;
  classSlug: string;
  className: string;
  icon: string;
};

const english: Record<string, string> = {
  武器战士: "Arms Warrior",
  狂怒战士: "Fury Warrior",
  防护战士: "Protection Warrior",
  惩戒圣骑士: "Retribution Paladin",
  神圣圣骑士: "Holy Paladin",
  防护圣骑士: "Protection Paladin",
  野兽控制猎人: "Beast Mastery Hunter",
  射击猎人: "Marksmanship Hunter",
  生存猎人: "Survival Hunter",
  奥术法师: "Arcane Mage",
  火焰法师: "Fire Mage",
  冰霜法师: "Frost Mage",
  戒律牧师: "Discipline Priest",
  神圣牧师: "Holy Priest",
  暗影牧师: "Shadow Priest",
  痛苦术士: "Affliction Warlock",
  恶魔学识术士: "Demonology Warlock",
  毁灭术士: "Destruction Warlock",
  奇袭潜行者: "Assassination Rogue",
  战斗潜行者: "Combat Rogue",
  敏锐潜行者: "Subtlety Rogue",
  元素萨满: "Elemental Shaman",
  增强萨满: "Enhancement Shaman",
  恢复萨满: "Restoration Shaman",
  平衡德鲁伊: "Balance Druid",
  野性战斗德鲁伊: "Feral Druid",
  恢复德鲁伊: "Restoration Druid",
};

const classRules: [string, string, string][] = [
  ["战士", "warrior", "Warrior"],
  ["圣骑士", "paladin", "Paladin"],
  ["猎人", "hunter", "Hunter"],
  ["潜行者", "rogue", "Rogue"],
  ["牧师", "priest", "Priest"],
  ["萨满", "shaman", "Shaman"],
  ["法师", "mage", "Mage"],
  ["术士", "warlock", "Warlock"],
  ["德鲁伊", "druid", "Druid"],
];

export const specTierOrder: SpecTier[] = ["S", "A", "B", "C"];
export const specTierRoleLabels: Record<SpecTierRole, string> = {
  dps: "DPS", tank: "Tank", healer: "Healer",
};

type RawRole = { total: number; tiers: Record<string, { specId: number; name: string; rank: number }[]> };
const data = raw as { levelCap: number; updatedAt: string; roles: Record<SpecTierRole, RawRole> };

export const specTierUpdatedAt = data.updatedAt;
export const specTierLevelCap = data.levelCap;

export const specTierData: Record<SpecTierRole, SpecTierItem[]> = {
  dps: [], tank: [], healer: [],
};

for (const role of Object.keys(data.roles) as SpecTierRole[]) {
  for (const tier of specTierOrder) {
    for (const item of data.roles[role].tiers[tier] ?? []) {
      const matchedClass = classRules.find(([zh]) => item.name.includes(zh));
      const classSlug = matchedClass?.[1] ?? "warrior";
      specTierData[role].push({
        specId: item.specId,
        name: item.name,
        nameEn: english[item.name] ?? item.name,
        tier,
        classSlug,
        className: matchedClass?.[2] ?? "Warrior",
        icon: `/classes/icons/${classSlug}.jpg`,
      });
    }
  }
}
