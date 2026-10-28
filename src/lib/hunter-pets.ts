import raw from "@/data/pets_full.json";
import old from "@/data/forever/pets.json";

export type PetSkillRank = {
  rank: number;
  spellId: number;
  petLevel: number;
  descCn: string;
};

export type PetSkill = {
  nameCn: string;
  icon: string;
  hasDetail?: boolean;
  beastKnown?: boolean;
  ranks: PetSkillRank[];
};

export type PetFamily = {
  slug: string;
  name: string;
  icon: string;
  diet: string;
  dmgLabel: string;
  hpLabel: string;
  armorLabel: string;
  beastCount: number;
  isNew: boolean;
  skills: PetSkill[];
};

export type PetBeast = {
  minLevel: number | null;
  maxLevel: number | null;
  skills: { nameCn?: string; icon?: string }[];
  entry: number;
  familyNameCn: string;
  familySlug: string;
  nameCn: string;
  nameEn: string;
  familyIcon: string;
  isNew: boolean;
  zonesCn: string;
  speed: number | null;
};

const familyEnglish = new Map(
  old.families.map((family) => [
    family.slug,
    { nameEn: family.nameEn, dietEn: family.dietEn },
  ]),
);

export const petFamilies = raw.families as PetFamily[];
export const petBeasts = raw.beasts as PetBeast[];

export function familyNameEn(slug: string, fallback: string): string {
  return familyEnglish.get(slug)?.nameEn ?? fallback;
}

export function familyDietEn(slug: string, fallback: string): string {
  return familyEnglish.get(slug)?.dietEn ?? fallback;
}

export const petSkillEntryCount = petFamilies.reduce(
  (sum, family) => sum + (family.skills?.length ?? 0),
  0,
);

export const petSkills = (() => {
  const map = new Map<string, PetSkill>();
  for (const family of petFamilies) {
    for (const skill of family.skills ?? []) {
      const current = map.get(skill.nameCn);
      if (!current) {
        map.set(skill.nameCn, { ...skill, ranks: [...skill.ranks] });
        continue;
      }
      const keys = new Set(current.ranks.map((rank) => `${rank.rank}-${rank.spellId}`));
      for (const rank of skill.ranks) {
        if (!keys.has(`${rank.rank}-${rank.spellId}`)) current.ranks.push(rank);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.nameCn.localeCompare(b.nameCn));
})();

export function petIcon(icon: string): string {
  return `/talents/icons/${icon}.jpg`;
}
