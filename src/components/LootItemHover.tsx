"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { DetailItem } from "@/lib/dungeon-details";
import type { FcItem } from "@/lib/fc-items";

const qualityColors: Record<string, string> = {
  "0": "#9d9d9d", "1": "#ffffff", "2": "#1eff00", "3": "#4aa3ff", "4": "#a335ee",
};

type Position = { left: number; top: number; above: boolean };

export function LootItemHover({ item, fc, size = 28 }: { item: DetailItem; fc?: FcItem; size?: number }) {
  const anchorRef = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const color = qualityColors[item.quality] ?? "#ede7d7";
  const meta = fc ? [fc.level ? `iLvl ${fc.level}` : "", fc.slot, fc.req ? `Req. ${fc.req}` : ""].filter(Boolean).join(" · ") : "";

  useEffect(() => setMounted(true), []);

  function show() {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = 320;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const above = rect.top > 300;
    setPosition({ left, top: above ? rect.top - 8 : rect.bottom + 8, above });
  }

  function hide() {
    setPosition(null);
  }

  const content = (
    <>
      {item.icon ? <img src={`https://foreverchanges.pro${item.icon}`} alt="" width={size} height={size} className="shrink-0 rounded border border-line/70 object-cover" style={{ width: size, height: size }} loading="lazy" /> : <span className="grid shrink-0 place-items-center rounded border border-line/70 bg-deep text-[9px] text-muted" style={{ width: size, height: size }}>?</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs" style={{ color }}>{item.name}</span>
        {item.type ? <span className="block text-[10px] text-muted">{item.type}</span> : null}
      </span>
    </>
  );

  const handlers = { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide };
  const id = item.href.match(/\/item\/(\d+)/)?.[1] ?? "";

  return (
    <>
      {id ? <Link ref={anchorRef as React.Ref<HTMLAnchorElement>} href={`/item/${id}`} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-white/[0.04]" aria-label={`${item.name} item details`} {...handlers}>{content}</Link> : <div ref={anchorRef as React.Ref<HTMLDivElement>} className="flex items-center gap-2 rounded px-1 py-1" tabIndex={0} {...handlers}>{content}</div>}
      {mounted && position ? createPortal(
        <div className="pointer-events-none fixed z-[9999] w-80 rounded-lg border border-line bg-panel p-3 text-left shadow-2xl" style={{ left: position.left, top: position.top, transform: position.above ? "translateY(-100%)" : undefined }}>
          <div className="flex items-center gap-2">
            {item.icon ? <img src={`https://foreverchanges.pro${item.icon}`} alt="" width={32} height={32} className="size-8 rounded border border-line/70 object-cover" /> : null}
            <div className="min-w-0"><p className="truncate text-xs font-medium" style={{ color }}>{fc?.name || item.name}</p><p className="text-[10px] text-muted">{item.type || fc?.slot || "Item"}</p>{meta ? <p className="text-[10px] text-muted/70">{meta}</p> : null}</div>
          </div>
          {fc?.bind ? <p className="mt-2 text-[10px] text-muted/80">{fc.bind}</p> : null}
          {fc?.stats?.length ? <div className="mt-2 space-y-0.5">{fc.stats.map((stat) => <p key={stat} className="text-[10px] text-[#1eff00]">{stat}</p>)}</div> : null}
          {fc?.effect?.length ? <div className="mt-2 space-y-0.5">{fc.effect.map((effect) => <p key={effect} className="text-[10px] leading-relaxed text-gold-soft">{effect}</p>)}</div> : null}
          {fc?.sell ? <p className="mt-2 text-[10px] text-muted/70">{fc.sell}</p> : null}
          <p className="mt-2 text-[10px] text-gold/80">Open item page →</p>
        </div>, document.body) : null}
    </>
  );
}
