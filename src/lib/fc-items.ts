import raw from "@/data/fc-items.json";

export type FcItem = {
  id: string;
  href: string;
  icon: string;
  name: string;
  quality: string;
  level: string;
  req: string;
  bind: string;
  sell: string;
  stats: string[];
  effect: string[];
  slot: string;
  summary: string;
};

const items = raw as unknown as Record<string, FcItem>;

export function getFcItem(id: string) {
  return items[id];
}

export function fcItemQualityLabel(quality: string) {
  return ({ "0": "Poor", "1": "Common", "2": "Uncommon", "3": "Rare", "4": "Epic" } as Record<string, string>)[quality] ?? "Item";
}
