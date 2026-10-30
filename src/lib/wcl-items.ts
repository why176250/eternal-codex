import raw from "@/data/wcl-items.json";

export type WclItem = {
  i: number;
  n: string;
  q: number;
  l: number | null;
  r: number | null;
  s: string;
  c: string;
  cc: number;
  k: string;
  st: "new" | "changed" | "same" | "missing";
  src: string;
};

export const wclItems = raw as WclItem[];
export const itemStatusLabels: Record<string, string> = {
  all: "All items",
  new: "New in Forever",
  changed: "Changed",
  same: "Unchanged",
  missing: "Not in Forever",
};
export const itemQualityLabels: Record<number, string> = {
  0: "Poor", 1: "Common", 2: "Uncommon", 3: "Rare", 4: "Epic", 5: "Legendary", 6: "Artifact",
};
export const itemQualityColors: Record<number, string> = {
  0: "#9d9d9d", 1: "#ffffff", 2: "#1eff00", 3: "#0070dd", 4: "#a335ee", 5: "#ff8000", 6: "#e6cc80",
};
export const itemCounts = {
  total: wclItems.length,
  new: wclItems.filter((item) => item.st === "new").length,
  changed: wclItems.filter((item) => item.st === "changed").length,
  same: wclItems.filter((item) => item.st === "same").length,
  missing: wclItems.filter((item) => item.st === "missing").length,
};
export const itemSlots = Array.from(new Set(wclItems.map((item) => item.s).filter(Boolean))).sort();
export const itemTypes = Array.from(new Set(wclItems.map((item) => item.c).filter(Boolean))).sort();

export function getWclItem(id: string | number) {
  return wclItems.find((item) => String(item.i) === String(id));
}
