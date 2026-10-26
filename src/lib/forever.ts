import dungeonsJson from "@/data/forever/dungeons.json";
import setsJson from "@/data/forever/sets.json";
import racialsJson from "@/data/forever/racials.json";
import vendorsJson from "@/data/forever/vendors.json";
import petsJson from "@/data/forever/pets.json";
import talentsJson from "@/data/forever/talents.json";
import guidesJson from "@/data/forever/guides.json";

export const foreverDungeons = dungeonsJson;
export const foreverSets = setsJson;
export const foreverRacials = racialsJson;
export const foreverVendors = vendorsJson;
export const foreverPets = petsJson;
export const foreverTalents = talentsJson;
export const foreverGuides = guidesJson;

export type ForeverDungeon = (typeof foreverDungeons)[number];
export type ForeverSet = (typeof foreverSets)[number];
export type ForeverRace = (typeof foreverRacials)[number];
export type ForeverRecipe = (typeof foreverVendors)[number];
export type ForeverPetFamily = (typeof foreverPets.families)[number];
export type ForeverBeast = (typeof foreverPets.beasts)[number];
export type ForeverTalentClass = (typeof foreverTalents)[number];
export type ForeverGuide = (typeof foreverGuides)[number];

export const professionLabels: Record<string, string> = {
  alchemy: "Alchemy",
  blacksmithing: "Blacksmithing",
  cooking: "Cooking",
  enchanting: "Enchanting",
  engineering: "Engineering",
  general: "General",
  leatherworking: "Leatherworking",
  tailoring: "Tailoring",
};
