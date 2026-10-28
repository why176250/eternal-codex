import dungeonsJson from "@/data/forever/dungeons.json";
import setsJson from "@/data/forever/sets.json";
import racialsJson from "@/data/forever/racials.json";
import vendorsJson from "@/data/forever/vendors.json";
import petsJson from "@/data/forever/pets.json";
import { foreverTalents } from "@/data/forever/wow-talents";
import guidesJson from "@/data/forever/guides.json";
import legacyJson from "@/data/forever/legacy.json";

export const foreverDungeons = dungeonsJson;
export const foreverSets = setsJson;
export const foreverRacials = racialsJson;
export const foreverVendors = vendorsJson;
export const foreverPets = petsJson;
export { foreverTalents };
export const foreverGuides = guidesJson;
export const foreverLegacy = legacyJson;

export type ForeverDungeon = (typeof foreverDungeons)[number];
export type ForeverSet = (typeof foreverSets)[number];
export type ForeverRace = (typeof foreverRacials)[number];
export type ForeverRecipe = (typeof foreverVendors)[number];
export type ForeverPetFamily = (typeof foreverPets.families)[number];
export type ForeverBeast = (typeof foreverPets.beasts)[number];
export type { ForeverTalentClass } from "@/data/forever/wow-talents";
export type ForeverGuide = (typeof foreverGuides)[number];
export type ForeverLegacy = typeof foreverLegacy;
export type ForeverLegacyTree = (typeof foreverLegacy.trees)[number];
export type ForeverLegacyNode = ForeverLegacyTree["nodes"][number];
export type ForeverLegacyMilestone = (typeof foreverLegacy.milestones)[number];

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
