"use client";

import { useMemo, useState } from "react";
import type { ForeverTalentClass } from "@/lib/forever";

export function TalentPlanner({ classes }: { classes: ForeverTalentClass[] }) {
  const [active, setActive] = useState(0);
  const [points, setPoints] = useState<Record<string, number>>({});

  const current = classes[active];

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
      <div className="flex flex-wrap gap-2">
        {classes.map((cls, index) => (
          <button
            key={cls.classId}
            type="button"
            onClick={() => {
              setActive(index);
              setPoints({});
            }}
            className={
              index === active
                ? "rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm text-gold-soft"
                : "rounded-md border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            }
          >
            {cls.className}
            <span className="ml-2 text-[11px] text-muted/70">{cls.nameZh}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">
          Points spent: <span className="text-parchment">{total}</span> / 51
        </span>
        <button
          type="button"
          onClick={() => setPoints({})}
          className="rounded-md border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
        >
          Reset
        </button>
      </div>

      <p className="mt-2 text-xs text-muted">
        Hover or tap a talent to see its ranks and requirements.
      </p>

      <div className="mt-5 grid gap-4">
        {current.trees.map((tree, treeIndex) => (
          <div key={tree.tabId} className="panel p-3">
            <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
              <div className="flex items-center gap-2">
                {tree.icon ? (
                  <img
                    src={`/talents/icons/${tree.icon}.jpg`}
                    alt=""
                    width={22}
                    height={22}
                    className="size-[22px] rounded border border-line"
                  />
                ) : null}
                <p className="text-sm text-parchment">
                  {tree.nameEn || tree.name}
                  <span className="ml-2 text-[11px] text-muted">{tree.name}</span>
                </p>
              </div>
              <span className="text-xs text-gold-soft">{treePoints(treeIndex)}</span>
            </div>

            <div
              className="mt-3 grid grid-cols-4 gap-2"
              style={{ gridTemplateRows: `repeat(${maxTier}, minmax(0, auto))` }}
            >
              {tree.talents.map((talent) => {
                const value = points[keyFor(treeIndex, talent.id)] ?? 0;
                const rank =
                  talent.ranks[Math.min(Math.max(value - 1, 0), talent.ranks.length - 1)];
                const rankText = rank?.en || rank?.zh || "";
                const tooltipSide = talent.colIndex >= 2 ? "right-0" : "left-0";

                return (
                  <div
                    key={talent.id}
                    style={{ gridColumn: talent.colIndex + 1, gridRow: talent.tierId }}
                    className={
                      "group relative rounded-md border p-1.5 " +
                      (value > 0
                        ? "border-gold/50 bg-gold/10"
                        : "border-line bg-deep/60")
                    }
                  >
                    <button
                      type="button"
                      onClick={() => change(treeIndex, talent.id, talent.maxRanks, 1)}
                      aria-label={`Add a point to ${talent.nameEn || talent.name}`}
                      className="flex w-full flex-col items-center text-center"
                    >
                      {talent.icon ? (
                        <img
                          src={`/talents/icons/${talent.icon}.jpg`}
                          alt=""
                          width={36}
                          height={36}
                          className="size-9 rounded border border-line/80"
                        />
                      ) : (
                        <span className="grid size-9 place-items-center rounded border border-line text-[10px] text-muted">
                          ?
                        </span>
                      )}
                      <span className="mt-1 line-clamp-2 w-full text-[10px] leading-tight text-parchment">
                        {talent.nameEn || talent.name}
                      </span>
                      <span className="mt-0.5 text-[10px] text-muted">
                        {value}/{talent.maxRanks}
                      </span>
                    </button>

                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        aria-label={`Remove a point from ${talent.nameEn || talent.name}`}
                        onClick={() => change(treeIndex, talent.id, talent.maxRanks, -1)}
                        className="flex-1 rounded border border-line text-[10px] text-muted hover:text-parchment"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label={`Add a point to ${talent.nameEn || talent.name}`}
                        onClick={() => change(treeIndex, talent.id, talent.maxRanks, 1)}
                        className="flex-1 rounded border border-line text-[10px] text-muted hover:text-parchment"
                      >
                        +
                      </button>
                    </div>

                    <div
                      className={`pointer-events-none absolute top-full z-40 mt-1 w-64 ${tooltipSide} rounded-lg border border-line bg-panel p-3 text-left opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100`}
                    >
                      <p className="text-xs font-medium text-parchment">
                        {talent.nameEn || talent.name}
                      </p>
                      <p className="text-[11px] text-muted">{talent.name}</p>
                      <p className="mt-1 text-[11px] text-teal">
                        Rank {value} / {talent.maxRanks}
                      </p>
                      {rankText ? (
                        <p className="mt-2 text-[11px] leading-relaxed text-muted">
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
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Planning preview: points are not yet validated against talent
        prerequisites or tree point requirements. Build sharing and validation
        come next.
      </p>
    </div>
  );
}
