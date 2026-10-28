import raw from "@/data/professions.json";

export type Recipe = {
  recipeId: number;
  spellId: number;
  itemId: number;
  localesName: string;
  icon: string;
  itemLevel: number;
  quality: number;
  minSkillLineRank: number;
  proColors: string;
  productType: number;
  reagents: { itemId: number; count: number; icon: string; nameCn: string }[];
  trivialHigh: number;
  trivialLow: number;
  skillLineId: number;
  professionName: string;
};

export type Profession = {
  skillLineId: number;
  name: string;
  icon: string;
  recipeCount: number;
};

export type CampItem = {
  itemId: number;
  nameCn: string;
  icon: string;
  itemLevel: number;
  quality: number;
  skillLineId: number;
  skillReq: number;
  effectDescCn: string;
  mutexCn: string;
};

type Raw = {
  professions: Profession[];
  recipesByProfession: Record<string, { name: string; count: number; recipes: Recipe[] }>;
  campItems: CampItem[];
};

const data = raw as Raw;

export const professionEnglish: Record<string, string> = {
  制皮: "Leatherworking",
  锻造: "Blacksmithing",
  裁缝: "Tailoring",
  工程学: "Engineering",
  附魔: "Enchanting",
  炼金术: "Alchemy",
  烹饪: "Cooking",
  急救: "First Aid",
  采矿: "Mining",
  草药学: "Herbalism",
  钓鱼: "Fishing",
  剥皮: "Skinning",
};

export const professions = data.professions;

export function getProfession(skillLineId: string | number) {
  return data.professions.find((p) => String(p.skillLineId) === String(skillLineId));
}

export function getRecipes(skillLineId: number): Recipe[] {
  return data.recipesByProfession[String(skillLineId)]?.recipes ?? [];
}

export function getCampItems(skillLineId: number): CampItem[] {
  return data.campItems.filter((item) => item.skillLineId === skillLineId);
}

export function professionIcon(icon: string): string {
  return `/professions/icons/${icon}`;
}

export function fallbackIcon(icon: string): string {
  return icon ? professionIcon(icon) : "/professions/icons/inv_misc_questionmark.jpg";
}

export function qualityColor(quality: number): string {
  return {
    0: "#9d9d9d",
    1: "#ffffff",
    2: "#1eff00",
    3: "#0070dd",
    4: "#a335ed",
    5: "#ff8000",
  }[quality] ?? "#9d9d9d";
}
