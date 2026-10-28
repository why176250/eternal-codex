"use client";

import { useState } from "react";
import { classNameEn, classIconPath, factionLabels, factionOrder, type Faction, type PopularityEntry } from "@/lib/popularity";

type Props = {
  factions: Record<Faction, PopularityEntry[]>;
  totalVotes: number;
};

export function PopularityTabs({ factions, totalVotes }: Props) {
  const [active, setActive] = useState<Faction>("全部");
  const rows = factions[active] ?? [];

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 p-4">
        <div
          role="tablist"
          aria-label="Faction filter"
          className="flex flex-wrap gap-2"
        >
          {factionOrder.map((faction) => {
            const selected = active === faction;
            return (
              <button
                key={factionLabels[faction]}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(faction)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  selected
                    ? "border-gold/60 bg-gold/[0.08] text-gold-soft"
                    : "border-line/70 text-muted hover:border-line hover:text-parchment"
                }`}
              >
                {factionLabels[faction]}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted">
          {totalVotes.toLocaleString("en-US")} votes
        </p>
      </div>

      <ol className="divide-y divide-line/50">
        {rows.map((row, index) => (
          <li
            key={row.classId}
            className="grid grid-cols-[2.2rem_2.5rem_minmax(0,1fr)_3.2rem] items-center gap-3 px-4 py-3 sm:grid-cols-[2.5rem_2.5rem_minmax(0,1fr)_5rem_7rem]"
          >
            <span className="display text-sm text-gold/45">#{index + 1}</span>
            <img
              src={classIconPath(row.icon)}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-md border border-line/80"
            />
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-parchment">{classNameEn(row)}</span>
                <span className="shrink-0 text-xs text-gold-soft">
                  {row.percent.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-deep/90">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold"
                  style={{ width: `${Math.max(1, row.percent)}%` }}
                />
              </div>
            </div>
            <span className="hidden text-right text-xs text-muted sm:block">
              {row.count.toLocaleString("en-US")} votes
            </span>
            <span className="text-right text-[10px] text-muted/60 sm:hidden">
              {row.count.toLocaleString("en-US")}
            </span>
          </li>
        ))}
      </ol>

      <div className="border-t border-line/70 px-4 py-3 text-[11px] leading-relaxed text-muted/60">
        Source: Blue Hermit mini-program launch class poll · one vote per player · personal, non-commercial use
      </div>
    </div>
  );
}
