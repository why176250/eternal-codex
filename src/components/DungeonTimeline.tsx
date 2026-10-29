"use client";

import Link from "next/link";
import { useState } from "react";
import dungeonImages from "@/data/dungeon-images.json";

export type TimelineDungeon = {
  id: string;
  name: string;
  band: string;
  isNew: boolean;
  note: string;
  desc: string;
  location: string;
};

export type TimelineEntry = {
  dungeon: TimelineDungeon;
  start: number;
  end: number;
  lane: number;
  left: number;
  width: number;
};

function Row({
  label,
  entries,
  hovered,
  hoveredStart,
  onHover,
}: {
  label: string;
  entries: TimelineEntry[];
  hovered: string | null;
  hoveredStart: number | null;
  onHover: (id: string | null) => void;
}) {
  const laneCount = Math.max(...entries.map((entry) => entry.lane), 0) + 1;
  return (
    <div className="border-t border-line/50 py-3 first:border-0">
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="relative" style={{ height: `${laneCount * 64}px` }}>
        {entries.map((entry) => {
          const { dungeon, lane, left, width, start, end } = entry;
          const isHovered = hovered === dungeon.id;
          const nearby = !hovered || isHovered || Math.abs(start - (hoveredStart ?? start)) <= 10;
          const dimmed = Boolean(hovered && !nearby);
          const align = left > 64 ? "right-0" : left < 18 ? "left-0" : "left-1/2 -translate-x-1/2";
          return (
            <div
              key={dungeon.id}
              className="absolute z-10 h-14 transition-[opacity,filter] duration-200 hover:z-40"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 10)}%`,
                top: `${lane * 60}px`,
                opacity: dimmed ? 0.25 : 1,
                filter: dimmed ? "grayscale(1)" : undefined,
              }}
              onMouseEnter={() => onHover(dungeon.id)}
              onMouseLeave={() => onHover(null)}
            >
              <Link
                href={`/dungeons/${dungeon.id}`}
                className="relative flex h-full w-full items-center overflow-hidden rounded-md border text-xs shadow-lg"
                style={{
                  borderColor: dungeon.isNew ? "#4ea8d888" : "#a9884c88",
                  backgroundColor: "#08111f",
                }}
              >
                <span
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${dungeonImages[dungeon.id as keyof typeof dungeonImages] ?? ""})` }}
                />
                <span
                  className="absolute inset-0"
                  style={{
                    background: dungeon.isNew
                      ? "linear-gradient(90deg, rgba(4,14,24,.82), rgba(4,14,24,.18))"
                      : "linear-gradient(90deg, rgba(18,13,8,.84), rgba(18,13,8,.18))",
                  }}
                />
                <span className="relative z-10 flex h-full min-w-0 flex-1 flex-col justify-between px-2 py-1.5 text-parchment">
                  <span className="truncate text-xs font-medium leading-tight md:text-sm">{dungeon.name}</span>
                  <span className="text-[10px] leading-none text-muted">{dungeon.band}</span>
                </span>
              </Link>

              {isHovered ? (
                <div className={`absolute bottom-full z-50 mb-2 w-80 ${align} overflow-hidden rounded-lg border border-gold/35 bg-panel shadow-2xl`}>
                  <div className="relative h-24 overflow-hidden bg-deep">
                    <span
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${dungeonImages[dungeon.id as keyof typeof dungeonImages] ?? ""})` }}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-parchment">{dungeon.name}</p>
                      <span className="shrink-0 text-[10px] text-muted">{dungeon.band}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted">
                      {dungeon.location || "Location pending"}
                      {dungeon.isNew ? <span className="ml-2 rounded border border-gold/35 px-1 py-0.5 text-gold-soft">New in Forever</span> : null}
                    </p>
                    <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-muted">{dungeon.desc || dungeon.note || "Open the dungeon page for bosses and loot."}</p>
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
}

export function DungeonTimeline({
  newEntries,
  classicEntries,
}: {
  newEntries: TimelineEntry[];
  classicEntries: TimelineEntry[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredStart =
    [...newEntries, ...classicEntries].find((entry) => entry.dungeon.id === hovered)?.start ?? null;
  return (
    <div>
      <Row label={`Forever new ${newEntries.length}`} entries={newEntries} hovered={hovered} hoveredStart={hoveredStart} onHover={setHovered} />
      <Row label={`From Classic ${classicEntries.length}`} entries={classicEntries} hovered={hovered} hoveredStart={hoveredStart} onHover={setHovered} />
    </div>
  );
}
