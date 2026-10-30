import warrior from "@/data/wcl-bis/warrior.json";
import hunter from "@/data/wcl-bis/hunter.json";
import mage from "@/data/wcl-bis/mage.json";
import rogue from "@/data/wcl-bis/rogue.json";
import priest from "@/data/wcl-bis/priest.json";
import warlock from "@/data/wcl-bis/warlock.json";
import paladin from "@/data/wcl-bis/paladin.json";
import druid from "@/data/wcl-bis/druid.json";
import shaman from "@/data/wcl-bis/shaman.json";

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

export function getBisClass(slug: string) {
  return all[slug] ? { data: all[slug], meta: bisClasses.find((entry) => entry.slug === slug)! } : undefined;
}
