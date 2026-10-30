import warrior from "@/data/wcl-bis/warrior.json";
import hunter from "@/data/wcl-bis/hunter.json";
import mage from "@/data/wcl-bis/mage.json";
import rogue from "@/data/wcl-bis/rogue.json";
import priest from "@/data/wcl-bis/priest.json";
import warlock from "@/data/wcl-bis/warlock.json";
import paladin from "@/data/wcl-bis/paladin.json";
import druid from "@/data/wcl-bis/druid.json";
import shaman from "@/data/wcl-bis/shaman.json";
import warriorTank from "@/data/wcl-bis/specs/warrior-tank.json";
import paladinHoly from "@/data/wcl-bis/specs/paladin-holy.json";
import paladinTank from "@/data/wcl-bis/specs/paladin-tank.json";
import rogueAssassination from "@/data/wcl-bis/specs/rogue-assassination.json";
import priestHoly from "@/data/wcl-bis/specs/priest-holy.json";
import priestDiscipline from "@/data/wcl-bis/specs/priest-discipline-pvp.json";
import shamanEnhancement from "@/data/wcl-bis/specs/shaman-enhancement.json";
import shamanRestoration from "@/data/wcl-bis/specs/shaman-restoration.json";
import mageFire from "@/data/wcl-bis/specs/mage-fire.json";
import mageArcane from "@/data/wcl-bis/specs/mage-arcane.json";
import druidBalance from "@/data/wcl-bis/specs/druid-balance.json";
import druidRestoration from "@/data/wcl-bis/specs/druid-restoration.json";
import druidTank from "@/data/wcl-bis/specs/druid-tank.json";

export type BisSlotItem = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  sources?: { text: string; href?: string | null }[];
  sourceLines?: { text: string; href?: string | null }[][];
  materials?: { id: number; name: string; icon: string; count: string }[];
  notes?: string[];
};
export type BisData = {
  slots: { key: string; name: string; items: BisSlotItem[] }[];
  enchants: { icon: string; slots: string; effect: string; title: string; id: number }[];
  specs: { href: string; name: string; icon: string }[];
  stats: Record<string, { name: string; value: string }[]>;
  statGroups: Record<string, { name: string; values: { name: string; value: string; up: boolean }[] }[]>;
  portraits: Record<string, string>;
  equipment: Record<string, { slot: string; label: string; name: string; id: number; icon: string; enchant?: string }[]>;
  items?: Record<string, { quality?: number }>;
  builds: { level: number; name: string; total: number; free: number; trees: { name: string; points: number }[] }[];
  route: string;
};

const all: Record<string, BisData> = {
  warrior: warrior as unknown as BisData,
  hunter: hunter as unknown as BisData,
  mage: mage as unknown as BisData,
  rogue: rogue as unknown as BisData,
  priest: priest as unknown as BisData,
  warlock: warlock as unknown as BisData,
  paladin: paladin as unknown as BisData,
  druid: druid as unknown as BisData,
  shaman: shaman as unknown as BisData,
};

export const bisClasses = [
  { slug: "warrior", name: "Warrior", color: "#C79C6E", icon: "/classes/icons/warrior.jpg" },
  { slug: "paladin", name: "Paladin", color: "#F58CBA", icon: "/classes/icons/paladin.jpg" },
  { slug: "hunter", name: "Hunter", color: "#ABD473", icon: "/classes/icons/hunter.jpg" },
  { slug: "rogue", name: "Rogue", color: "#FFF569", icon: "/classes/icons/rogue.jpg" },
  { slug: "priest", name: "Priest", color: "#FFFFFF", icon: "/classes/icons/priest.jpg" },
  { slug: "shaman", name: "Shaman", color: "#0070DE", icon: "/classes/icons/shaman.jpg" },
  { slug: "mage", name: "Mage", color: "#69CCF0", icon: "/classes/icons/mage.jpg" },
  { slug: "warlock", name: "Warlock", color: "#9482C9", icon: "/classes/icons/warlock.jpg" },
  { slug: "druid", name: "Druid", color: "#FF7D0A", icon: "/classes/icons/druid.jpg" },
];

const specData: Record<string, BisData> = {
  "warrior-tank": warriorTank as unknown as BisData,
  "paladin-holy": paladinHoly as unknown as BisData,
  "paladin-tank": paladinTank as unknown as BisData,
  "rogue-assassination": rogueAssassination as unknown as BisData,
  "priest-holy": priestHoly as unknown as BisData,
  "priest-discipline": priestDiscipline as unknown as BisData,
  "shaman-enhancement": shamanEnhancement as unknown as BisData,
  "shaman-restoration": shamanRestoration as unknown as BisData,
  "mage-fire": mageFire as unknown as BisData,
  "mage-arcane": mageArcane as unknown as BisData,
  "druid-balance": druidBalance as unknown as BisData,
  "druid-restoration": druidRestoration as unknown as BisData,
  "druid-tank": druidTank as unknown as BisData,
};

export type BisSpecOption = { key: string; name: string; data?: string; fallback?: boolean; icon: string };
export const bisSpecOptions: Record<string, BisSpecOption[]> = {
  warrior: [{ key: "arms", name: "Arms", icon: "ability_warrior_savageblow" }, { key: "fury", name: "Fury", fallback: true, icon: "ability_warrior_innerrage" }, { key: "protection", name: "Protection", data: "warrior-tank", icon: "ability_warrior_defensivestance" }],
  paladin: [{ key: "holy", name: "Holy", data: "paladin-holy", icon: "spell_holy_holybolt" }, { key: "protection", name: "Protection", data: "paladin-tank", icon: "spell_holy_devotionaura" }, { key: "retribution", name: "Retribution", icon: "spell_holy_auraoflight" }],
  hunter: [{ key: "beastmastery", name: "Beast Mastery", icon: "ability_hunter_beasttaming" }, { key: "marksmanship", name: "Marksmanship", fallback: true, icon: "ability_marksmanship" }, { key: "survival", name: "Survival", fallback: true, icon: "ability_hunter_swiftstrike" }],
  rogue: [{ key: "assassination", name: "Assassination", data: "rogue-assassination", icon: "ability_rogue_eviscerate" }, { key: "combat", name: "Combat", icon: "ability_backstab" }, { key: "subtlety", name: "Subtlety", fallback: true, icon: "ability_stealth" }],
  priest: [{ key: "discipline", name: "Discipline", data: "priest-discipline", icon: "spell_holy_wordfortitude" }, { key: "holy", name: "Holy", data: "priest-holy", icon: "spell_holy_guardianspirit" }, { key: "shadow", name: "Shadow", icon: "spell_shadow_shadowwordpain" }],
  shaman: [{ key: "elemental", name: "Elemental", icon: "spell_nature_lightning" }, { key: "enhancement", name: "Enhancement", data: "shaman-enhancement", icon: "spell_nature_lightningshield" }, { key: "restoration", name: "Restoration", data: "shaman-restoration", icon: "spell_nature_magicimmunity" }],
  mage: [{ key: "arcane", name: "Arcane", data: "mage-arcane", icon: "spell_holy_magicalsentry" }, { key: "fire", name: "Fire", data: "mage-fire", icon: "spell_fire_firebolt02" }, { key: "frost", name: "Frost", icon: "spell_frost_frostbolt02" }],
  warlock: [{ key: "affliction", name: "Affliction", icon: "spell_shadow_deathcoil" }, { key: "demonology", name: "Demonology", fallback: true, icon: "spell_shadow_metamorphosis" }, { key: "destruction", name: "Destruction", fallback: true, icon: "spell_shadow_rainoffire" }],
  druid: [{ key: "balance", name: "Balance", data: "druid-balance", icon: "spell_nature_starfall" }, { key: "feral", name: "Feral", icon: "ability_racial_bearform" }, { key: "restoration", name: "Restoration", data: "druid-restoration", icon: "spell_nature_healingtouch" }],
};

export function getBisClass(slug: string) {
  return all[slug] ? { data: all[slug], meta: bisClasses.find((entry) => entry.slug === slug)! } : undefined;
}

export function getBisSpec(slug: string, specKey: string): { data: BisData; option: BisSpecOption } | undefined {
  const options = bisSpecOptions[slug];
  const option = options?.find((entry) => entry.key === specKey) ?? options?.[0];
  if (!option) return undefined;
  return { data: option.data ? specData[option.data] : all[slug], option };
}
