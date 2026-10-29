import raw from "@/data/bis-full.json";

export type BisItem = {
  id: number;
  name: string;
  nameCn: string;
  icon: string;
  itemLevel: number;
  quality: number;
  requiredLevel: number;
  sourceStr: string;
  sourceNote: string;
  sideName: string;
};

export type BisSlot = {
  invPos: number;
  best: BisItem[];
  options: BisItem[][];
  remark?: string;
  tag?: string;
};

export type BisBuild = {
  key: string;
  classId: number;
  className: string;
  specName: string;
  stage: number;
  slug: string;
  mode: "PvE" | "PvP";
  side: string;
  slots: BisSlot[];
};

const classNames: Record<number, string> = {
  1: "Warrior", 2: "Paladin", 3: "Hunter", 4: "Mage", 5: "Priest",
  6: "Warlock", 7: "Rogue", 8: "Shaman", 9: "Druid",
};
const specEnglish: Record<string, string> = {
  惩戒: "Retribution", 神圣: "Holy", 暗影: "Shadow", 平衡: "Balance",
  增强: "Enhancement", 戒律: "Discipline", 恢复: "Restoration", 元素: "Elemental",
  野性: "Feral", 坦克: "Tank", 神圣震击: "Holy Shock",
};
const slotNames: Record<number, string> = {
  1: "Head", 2: "Neck", 3: "Shoulder", 5: "Chest", 6: "Waist", 7: "Legs", 8: "Feet", 9: "Wrist",
  10: "Hands", 11: "Ring", 12: "Trinket", 13: "Main hand", 14: "Off hand", 15: "Ranged", 16: "Back",
  17: "Two-hand", 20: "Chest",
};

function parseKey(key: string) {
  const match = key.match(/^c(\d)_(.+)_s(\d+)$/);
  if (!match) return { classId: 0, specName: key, stage: 1 };
  const [, classId, specName, stage] = match;
  return { classId: Number(classId), specName, stage: Number(stage) };
}

export const bisBuilds: BisBuild[] = Object.entries(raw).map(([key, value]) => {
  const result = (value as unknown as { result: { invItems?: { invPos: number; best?: BisItem[]; options?: BisItem[][]; remark?: string; tag?: string }[]; side?: string } }).result;
  const parsed = parseKey(key);
  const mode = parsed.specName.includes("PvP") ? "PvP" : "PvE";
  const specName = parsed.specName.replace("PvP", "").trim();
  return {
    key,
    classId: parsed.classId,
    className: classNames[parsed.classId] ?? `Class ${parsed.classId}`,
    specName: specEnglish[specName] ?? specName,
    stage: parsed.stage,
    slug: `c${parsed.classId}-${(specEnglish[specName] ?? specName).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${parsed.specName.includes("PvP") ? "pvp" : "pve"}-s${parsed.stage}`,
    mode,
    side: result.side ?? "",
    slots: (result.invItems ?? []).map((slot) => ({
      invPos: slot.invPos,
      best: slot.best ?? [],
      options: slot.options ?? [],
      remark: slot.remark,
      tag: slot.tag,
    })),
  };
});

export function getBisBuild(key: string) {
  return bisBuilds.find((build) => build.slug === key || build.key === key);
}
