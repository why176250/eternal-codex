"use client";

import { useState } from "react";

type Entry = { classId: number; name: string; count: number; percent: number };
export function ClassPopulationTabs({ factions, totalCharacters }: { factions: Record<string, Entry[]>; totalCharacters: number }) {
  const [faction, setFaction] = useState("All");
  const entries = factions[faction] ?? [];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(factions).map((key) => (
            <button key={key} type="button" onClick={() => setFaction(key)} className={`rounded-full border px-3 py-1.5 text-xs ${faction === key ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}>
              {key}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-muted">{entries.reduce((sum, entry) => sum + entry.count, 0).toLocaleString("en-US")} characters</span>
      </div>
      <div className="mt-4 space-y-2">
        {entries.map((entry) => (
          <div key={entry.classId} className="panel flex items-center gap-3 p-3">
            <img src={`/classes/icons/${entry.name.toLowerCase()}.jpg`} alt="" width={36} height={36} className="size-9 rounded-lg border border-line/70 object-cover" />
            <span className="w-24 shrink-0 text-sm text-parchment">{entry.name}</span>
            <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-deep"><span className="block h-full rounded-full bg-gold/70" style={{ width: `${Math.min(100, entry.percent * 5)}%` }} /></span>
            <span className="w-16 text-right text-xs text-gold-soft">{entry.percent.toFixed(1)}%</span>
            <span className="w-24 text-right text-xs text-muted">{entry.count.toLocaleString("en-US")}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-muted/60">Total census: {totalCharacters.toLocaleString("en-US")} characters.</p>
    </div>
  );
}
