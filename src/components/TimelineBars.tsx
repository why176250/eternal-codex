"use client";

import Link from "next/link";
import { useState } from "react";
import type { TimelineEntry, TimelineLane } from "@/lib/dungeon-timeline";

function overlaps(a: TimelineEntry, b: TimelineEntry) {
  const pad = 6;
  return a.left < b.left + b.width + pad && a.left + a.width > b.left - pad;
}

export function TimelineBars({ lanes }: { lanes: TimelineLane[] }) {
  const [hovered, setHovered] = useState<TimelineEntry | null>(null);

  return (
    <div>
      {lanes.map((lane) => {
        const rows = Math.max(...lane.dungeons.map((dungeon) => dungeon.row), 0) + 1;
        return (
          <div key={lane.name} className="border-t border-line/40 py-3 first:border-0">
            <div className="mb-2 flex items-baseline gap-2 text-[10px] uppercase tracking-[0.18em] text-muted">
              <span>{lane.nameEn}</span>
              <span className="text-muted/60">{lane.count}</span>
            </div>
            <div className="relative" style={{ height: `${rows * 54}px` }}>
              {lane.dungeons.map((dungeon) => {
                const nearRight = dungeon.left + dungeon.width >= 98;
                const active = hovered?.id === dungeon.id;
                const nearby = !hovered || active || overlaps(dungeon, hovered);
                const dimmed = Boolean(hovered && !nearby);
                const align = dungeon.left > 62 ? "right-0" : dungeon.left < 18 ? "left-0" : "left-1/2 -translate-x-1/2";
                return (
                  <div
                    key={dungeon.name}
                    className="absolute z-10 h-[46px] transition-[opacity,filter] duration-200 hover:z-40"
                    style={{
                      ...(nearRight ? { right: 0 } : { left: `${dungeon.left}%` }),
                      width: `max(${dungeon.width}%, 90px)`,
                      minWidth: "90px",
                      top: `${dungeon.row * 52}px`,
                      opacity: dimmed ? 0.22 : 1,
                      filter: dimmed ? "grayscale(1)" : undefined,
                    }}
                    onMouseEnter={() => setHovered(dungeon)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(dungeon)}
                    onBlur={() => setHovered(null)}
                  >
                    <Link
                      href={`/dungeons/${dungeon.id}`}
                      title={`${dungeon.nameEn} · ${dungeon.levelMin}-${dungeon.levelMax}`}
                      className="relative flex h-full w-full items-center rounded-lg border shadow-sm"
                      style={{
                        borderColor: dungeon.category === "new" ? "#4ea8d888" : "#a9884c88",
                        backgroundColor: "#08111f",
                      }}
                    >
                      <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: dungeon.image ? `url(${dungeon.image})` : undefined, filter: "brightness(1.25)" }} />
                      <span className="absolute inset-0" style={{ background: dungeon.category === "new" ? "linear-gradient(90deg, rgba(4,14,24,.58), rgba(4,14,24,.12))" : "linear-gradient(90deg, rgba(18,13,8,.62), rgba(18,13,8,.12))" }} />
                      <span className="relative z-10 flex h-full min-w-0 flex-1 flex-col justify-center gap-0.5 px-2.5 py-1.5">
                        <span className="whitespace-nowrap text-[11px] leading-tight text-white">{dungeon.nameEn}</span>
                        <span className="text-[11px] leading-none text-neutral-400">{dungeon.levelMin}-{dungeon.levelMax}</span>
                      </span>
                    </Link>
                    {active ? (
                      <div className={`absolute bottom-full z-50 mb-2 w-72 ${align} overflow-hidden rounded-lg border border-gold/35 bg-panel shadow-2xl`}>
                        <div className="relative h-24 overflow-hidden bg-deep">
                          <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: dungeon.image ? `url(${dungeon.image})` : undefined, filter: "brightness(1.25)" }} />
                          <span className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
                        </div>
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-parchment">{dungeon.nameEn}</p>
                            <span className="shrink-0 text-[10px] text-muted">{dungeon.levelMin}-{dungeon.levelMax}</span>
                          </div>
                          {dungeon.category === "new" ? <span className="mt-1 inline-block rounded border border-gold/35 px-1 py-0.5 text-[9px] text-gold-soft">New in Forever</span> : null}
                          <p className="mt-2 text-[11px] leading-relaxed text-muted">Open the dungeon page for bosses, loot, and location notes.</p>
                          <Link href={`/dungeons/${dungeon.id}`} className="mt-2 inline-block text-[11px] text-gold/85 hover:text-gold-soft">Open dungeon →</Link>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
