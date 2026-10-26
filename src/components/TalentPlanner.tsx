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

  const maxTier = Math.max(...current.trees.flatMap((tree) => tree.talents.map((t) => t.tierId)));

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

      <div className="mt-5 grid gap-4">
        {current.trees.map((tree, treeIndex) => (
          <div key={tree.tabId} className="panel p-3">
            <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
              <p className="text-sm text-parchment">
                {tree.nameEn || tree.name}
                <span className="ml-2 text-[11px] text-muted">{tree.name}</span>
              </p>
              <span className="text-xs text-gold-soft">{treePoints(treeIndex)}</span>
            </div>

            <div
              className="mt-2 grid grid-cols-4 gap-1.5"
              style={{ gridTemplateRows: `repeat(${maxTier}, minmax(0, auto))` }}
            >
              {tree.talents.map((talent) => {
                const value = points[keyFor(treeIndex, talent.id)] ?? 0;
                const rankText =
                  value > 0 ? talent.ranks[Math.min(value - 1, talent.ranks.length - 1)]?.zh : "";
                return (
                  <div
                    key={talent.id}
                    style={{ gridColumn: talent.colIndex + 1, gridRow: talent.tierId }}
                    className={
                      value > 0
                        ? "rounded-md border border-gold/50 bg-gold/10 p-1.5"
                        : "rounded-md border border-line bg-deep/60 p-1.5"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => change(treeIndex, talent.id, talent.maxRanks, 1)}
                      className="block w-full text-left"
                      title={rankText || talent.reqText || talent.nameEn}
                    >
                      <span className="block truncate text-[11px] leading-tight text-parchment">
                        {talent.nameEn || talent.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-muted">
                        {value}/{talent.maxRanks}
                      </span>
                    </button>
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        aria-label={`Remove point from ${talent.name}`}
                        onClick={() => change(treeIndex, talent.id, talent.maxRanks, -1)}
                        className="flex-1 rounded border border-line text-[10px] text-muted hover:text-parchment"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label={`Add point to ${talent.name}`}
                        onClick={() => change(treeIndex, talent.id, talent.maxRanks, 1)}
                        className="flex-1 rounded border border-line text-[10px] text-muted hover:text-parchment"
                      >
                        +
                      </button>
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
