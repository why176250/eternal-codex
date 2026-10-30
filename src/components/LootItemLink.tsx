import { getFcItem } from "@/lib/fc-items";
import type { DetailItem } from "@/lib/dungeon-details";
import { LootItemHover } from "@/components/LootItemHover";

function itemId(href: string) {
  return href.match(/\/item\/(\d+)/)?.[1] ?? "";
}

export function LootItemLink({ item, size = 28 }: { item: DetailItem; size?: number }) {
  const id = itemId(item.href);
  return <LootItemHover item={item} fc={id ? getFcItem(id) : undefined} size={size} />;
}
