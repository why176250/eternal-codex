"use client";

import { useMemo, useState } from "react";
import type { ForeverTalentClass } from "@/lib/forever";

const CLASS_ACCENT: Record<string, string> = {
  Warrior: "#C79C6E",
  Paladin: "#F58CBA",
  Hunter: "#ABD473",
  Rogue: "#FFF569",
  Priest: "#FFFFFF",
  Shaman: "#0070DE",
  Mage: "#69CCF0",
  Warlock: "#9482C9",
  Druid: "#FF7D0A",
};

export function TalentPlanner({ classes }: { classes: ForeverTalentClass[] }) {
  const [active, setActive] = useState(0);
  const [points, setPoints] = useState<Record<string, number>>({});

  const current = classes[active];
  const accent = CLASS_ACCENT[current.className] ?? "#e3bd78";

  const total = useMemo(
    () => Object.values(points).reduce((sum, value) => sum + value, 0),
    [points],
  );

  function keyFor(treeIndex: number, talentId: number) {
    return `${current.classId}-${treeIndex}-${talentId}`;
  }

  function change(treeIndex: number, talentId: number, max: number, delta: number) {
    const key = keyFor(treeIndex, talentId);
    setPoints((prev) => {
      const next = Math.min(max, Math.max(0, (prev[key] ?? 0) + delta));
      return { ...prev, [key]: next };
    });
  }

  function treePoints(treeIndex: number) {
    const tree = current.trees[treeIndex];
    return tree.talents.reduce(
      (sum, talent) => sum + (points[keyFor(treeIndex, talent.id)] ?? 0),
      0,
    );
  }

  const maxTier = Math.max(
    ...current.trees.flatMap((tree) => tree.talents.map((t) => t.tierId)),
  );

  return (
    <div>
      {/* Class tabs */}
      <div className="flex flex-wrap gap-2">
        {classes.map((cls, index) => {
          const isActive = index === active;
          return (
            <button
              key={cls.classId}
              type="button"
              onClick={() => {
                setActive(index);
                setPoints({});
              }}
              className={
                "rounded-md border px-3 py-1.5 text-sm transition-colors " +
                (isActive
                  ? "border-gold/50 bg-gold/10 text-gold-soft"
                  : "border-line text-muted hover:border-gold/40 hover:text-parchment")
              }
            >
              {cls.className}
              <span className="ml-2 text-[11px] text-muted/70">{cls.nameZh}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted">
            Points: <span className="text-parchment">{total}</span> / 51
          </span>
          <span className="hidden text-xs text-muted/70 sm:inline">
            Left click to add · right click to remove
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPoints({})}
          className="rounded-md border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
        >
          Reset
        </button>
      </div>

      {/* Three trees side by side */}
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {current.trees.map((tree, treeIndex) => {
          const spent = treePoints(treeIndex);
          return (
            <section
              key={tree.tabId}
              className="overflow-visible rounded-xl border border-line bg-gradient-to-b from-panel to-deep p-3"
              style={{ borderTopColor: accent, borderTopWidth: 3 }}
            >
              <header className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-md border bg-deep"
                    style={{ borderColor: `${accent}66` }}
                  >
                    {tree.icon ? (
                      <img
                        src={`/talents/icons/${tree.icon}.jpg`}
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 rounded"
                      />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-parchment">
                      {tree.nameEn || tree.name}
                    </p>
                    <p className="truncate text-[10px] text-muted">{tree.name}</p>
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
                  style={{ borderColor: `${accent}55`, color: accent }}
                >
                  {spent}
                </span>
              </header>

              <div
                className="mt-3 grid grid-cols-4 gap-x-2 gap-y-2"
                style={{ gridTemplateRows: `repeat(${maxTier}, minmax(0, auto))` }}
              >
                {tree.talents.map((talent) => {
                  const value = points[keyFor(treeIndex, talent.id)] ?? 0;
                  const rank =
                    talent.ranks[Math.min(Math.max(value - 1, 0), talent.ranks.length - 1)];
                  const rankText = rank?.en || rank?.zh || "";
                  const tooltipSide =
                    talent.colIndex <= 1
                      ? "left-0"
                      : talent.colIndex >= 4
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2";

                  return (
                    <div
                      key={talent.id}
                      style={{ gridColumn: talent.colIndex, gridRow: talent.tierId }}
                      className="group relative flex flex-col items-center"
                    >
                      <button
                        type="button"
                        onClick={() => change(treeIndex, talent.id, talent.maxRanks, 1)}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          change(treeIndex, talent.id, talent.maxRanks, -1);
                        }}
                        aria-label={`${talent.nameEn || talent.name}: add a point`}
                        className="relative rounded-md transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                      >
                        <img
                          src={`/talents/icons/${talent.icon}.jpg`}
                          alt=""
                          width={40}
                          height={40}
                          className={
                            "size-10 rounded border " +
                            (value > 0
                              ? "border-gold/80 shadow-[0_0_10px_rgba(227,189,120,0.25)]"
                              : "border-line/80 opacity-90")
                          }
                        />
                        <span
                          className={
                            "absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded px-1 text-[9px] leading-4 " +
                            (value > 0
                              ? "bg-gold text-abyss"
                              : "bg-abyss/90 text-muted")
                          }
                        >
                          {value}/{talent.maxRanks}
                        </span>
                        {value > 0 ? (
                          <span
                            className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full border border-line bg-abyss text-[9px] text-muted hover:text-parchment"
                            onClick={(event) => {
                              event.stopPropagation();
                              change(treeIndex, talent.id, talent.maxRanks, -1);
                            }}
                            role="button"
                            aria-label={`Remove a point from ${talent.nameEn || talent.name}`}
                          >
                            −
                          </span>
                        ) : null}
                      </button>

                      {/* Hover tooltip */}
                      <div
                        className={`pointer-events-none absolute top-full z-50 mt-2 w-72 ${tooltipSide} rounded-lg border border-line bg-panel p-3 text-left opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100`}
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={`/talents/icons/${talent.icon}.jpg`}
                            alt=""
                            width={32}
                            height={32}
                            className="mt-0.5 size-8 shrink-0 rounded border border-line"
                          />
                          <div>
                            <p className="text-xs font-medium text-parchment">
                              {talent.nameEn || talent.name}
                            </p>
                            <p className="text-[11px] text-muted">{talent.name}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-teal">
                          Rank {value} / {talent.maxRanks}
                        </p>
                        {rankText ? (
                          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                            {rankText}
                          </p>
                        ) : null}
                        {rank?.zh && rank.zh !== rankText ? (
                          <p className="mt-1 text-[10px] leading-relaxed text-muted/70">
                            {rank.zh}
                          </p>
                        ) : null}
                        {talent.reqText ? (
                          <p className="mt-2 text-[10px] text-gold/90">
                            Requires: {talent.reqText}
                          </p>
                        ) : null}
                        {talent.classicStatus && talent.classicStatus !== "unchanged" ? (
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-gold/70">
                            {talent.classicStatus}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Planning preview: points are not yet validated against talent
        prerequisites or tree point requirements. Build sharing and validation
        come next.
      </p>
    </div>
  );
}
