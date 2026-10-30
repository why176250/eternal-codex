import Link from "next/link";
import type { DetailItem } from "@/lib/dungeon-details";
import { getFcItem } from "@/lib/fc-items";

const qualityColors: Record<string, string> = {
  "0": "#9d9d9d", "1": "#ffffff", "2": "#1eff00", "3": "#4aa3ff", "4": "#a335ee",
};

function itemId(href: string) {
  return href.match(/\/item\/(\d+)/)?.[1] ?? "";
}

export function LootItemLink({ item, size = 28 }: { item: DetailItem; size?: number }) {
  const id = itemId(item.href);
  const color = qualityColors[item.quality] ?? "#ede7d7";
  const fc = id ? getFcItem(id) : undefined;
  const meta = fc ? [fc.level ? `iLvl ${fc.level}` : "", fc.slot, fc.req ? `Req. ${fc.req}` : ""].filter(Boolean).join(" · ") : "";
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
    <span className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 hidden w-72 rounded-lg border border-line bg-panel p-3 shadow-2xl group-hover:block group-focus-within:block">
      <span className="flex items-center gap-2">
        {item.icon ? <img src={`https://foreverchanges.pro${item.icon}`} alt="" width={32} height={32} className="size-8 rounded border border-line/70 object-cover" /> : null}
        <span className="min-w-0"><span className="block truncate text-xs font-medium" style={{ color }}>{fc?.name || item.name}</span><span className="block text-[10px] text-muted">{item.type || fc?.slot || "Item"}</span>{meta ? <span className="block text-[10px] text-muted/70">{meta}</span> : null}</span>
      </span>
      {fc?.bind ? <span className="mt-2 block text-[10px] text-muted/80">{fc.bind}</span> : null}
      {fc?.stats?.length ? <span className="mt-2 block space-y-0.5">{fc.stats.map((stat) => <span key={stat} className="block text-[10px] text-[#1eff00]">{stat}</span>)}</span> : null}
      {fc?.effect?.length ? <span className="mt-2 block space-y-0.5">{fc.effect.map((effect) => <span key={effect} className="block text-[10px] leading-relaxed text-gold-soft">{effect}</span>)}</span> : null}
      {fc?.sell ? <span className="mt-2 block text-[10px] text-muted/70">{fc.sell}</span> : null}
      <span className="mt-2 block text-[10px] text-gold/80">Open item page →</span>
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
