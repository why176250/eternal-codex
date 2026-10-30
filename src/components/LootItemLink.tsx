import Link from "next/link";
import type { DetailItem } from "@/lib/dungeon-details";

const qualityColors: Record<string, string> = {
  "0": "#9d9d9d", "1": "#ffffff", "2": "#1eff00", "3": "#4aa3ff", "4": "#a335ee",
};

function itemId(href: string) {
  return href.match(/\/item\/(\d+)/)?.[1] ?? "";
}

export function LootItemLink({ item, size = 28 }: { item: DetailItem; size?: number }) {
  const id = itemId(item.href);
  const color = qualityColors[item.quality] ?? "#ede7d7";
  const content = (
    <>
      {item.icon ? <img src={`https://foreverchanges.pro${item.icon}`} alt="" width={size} height={size} className="shrink-0 rounded border border-line/70 object-cover" style={{ width: size, height: size }} loading="lazy" /> : <span className="grid shrink-0 place-items-center rounded border border-line/70 bg-deep text-[9px] text-muted" style={{ width: size, height: size }}>?</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs" style={{ color }}>{item.name}</span>
        {item.type ? <span className="block text-[10px] text-muted">{item.type}</span> : null}
      </span>
    </>
  );
  const tooltip = (
    <span className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 hidden w-56 rounded-lg border border-line bg-panel p-2.5 shadow-2xl group-hover:block group-focus-within:block">
      <span className="flex items-center gap-2">
        {item.icon ? <img src={`https://foreverchanges.pro${item.icon}`} alt="" width={28} height={28} className="size-7 rounded border border-line/70 object-cover" /> : null}
        <span className="min-w-0"><span className="block truncate text-xs font-medium" style={{ color }}>{item.name}</span><span className="block text-[10px] text-muted">{item.type || "Item"}</span></span>
      </span>
      <span className="mt-1 block text-[10px] text-gold/80">Open item page →</span>
    </span>
  );
  return id ? (
    <Link href={`/item/${id}`} className="group relative flex items-center gap-2 rounded px-1 py-1 hover:bg-white/[0.04]" aria-label={`${item.name} item details`}>
      {content}{tooltip}
    </Link>
  ) : (
    <div className="group relative flex items-center gap-2 rounded px-1 py-1">{content}{tooltip}</div>
  );
}
