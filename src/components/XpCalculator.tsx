"use client";

import { useMemo, useState } from "react";
import {
  eliteXp,
  formatNumber,
  killsNeeded,
  MAX_LEVEL,
  mobXp,
  questXp,
  xpToNext,
} from "@/lib/xp";

type Tab = "kills" | "quests";
type Mode = "xp" | "pct";

export function XpCalculator() {
  const [level, setLevel] = useState(35);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<Mode>("xp");
  const [rested, setRested] = useState(0);
  const [food, setFood] = useState(false);
  const [tab, setTab] = useState<Tab>("kills");

  const levelXp = xpToNext(level);
  const progressXp =
    mode === "pct"
      ? Math.round((levelXp * Math.min(Math.max(progress, 0), 100)) / 100)
      : Math.min(Math.max(progress, 0), levelXp);
  const remaining = Math.max(0, levelXp - progressXp);
  const percent = levelXp === 0 ? 0 : (progressXp / levelXp) * 100;

  const mobRows = useMemo(() => {
    const rows = [];
    for (let m = Math.max(1, level - 7); m <= Math.min(MAX_LEVEL, level + 3); m++) {
      const base = mobXp(level, m);
      const perKill = food ? Math.round(base * 1.05) : base;
      const elite = eliteXp(level, m);
      const elitePerKill = food ? Math.round(elite * 1.05) : elite;
      rows.push({
        mobLevel: m,
        base,
        kills: killsNeeded(remaining, perKill, Math.max(rested, 0)),
        elite,
        eliteKills: killsNeeded(remaining, elitePerKill, Math.max(rested, 0)),
      });
    }
    return rows;
  }, [level, remaining, food, rested]);

  const questRows = useMemo(() => {
    const rows = [];
    for (let q = Math.max(1, level - 7); q <= Math.min(MAX_LEVEL, level + 4); q++) {
      const xp = questXp(level, q);
      rows.push({
        questLevel: q,
        xp,
        count: xp > 0 ? Math.ceil(remaining / xp) : 0,
      });
    }
    return rows;
  }, [level, remaining]);

  function changeLevel(next: number) {
    const clamped = Math.min(MAX_LEVEL, Math.max(1, next));
    setLevel(clamped);
    setProgress(0);
  }

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <section className="panel p-5">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <span className="text-sm text-muted">Level</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeLevel(level - 1)}
              disabled={level <= 1}
              className="grid size-10 place-items-center rounded-lg border border-line bg-panel text-lg text-parchment transition-colors hover:border-gold/40 disabled:opacity-40"
              aria-label="Decrease level"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={MAX_LEVEL}
              value={level}
              onChange={(e) => changeLevel(Number(e.target.value) || 1)}
              className="w-24 rounded-lg border border-line bg-deep px-3 py-2 text-center text-lg text-parchment outline-none focus:border-gold/50"
              aria-label="Player level"
            />
            <button
              type="button"
              onClick={() => changeLevel(level + 1)}
              disabled={level >= MAX_LEVEL}
              className="grid size-10 place-items-center rounded-lg border border-line bg-panel text-lg text-parchment transition-colors hover:border-gold/40 disabled:opacity-40"
              aria-label="Increase level"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <span className="text-sm text-muted">Current progress</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value) || 0)}
              disabled={level === MAX_LEVEL}
              className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-parchment outline-none focus:border-gold/50 disabled:opacity-40"
              aria-label="Current progress"
            />
            <div className="flex overflow-hidden rounded-lg border border-line text-xs">
              <button
                type="button"
                onClick={() => setMode("xp")}
                className={
                  mode === "xp"
                    ? "bg-teal/20 px-3 py-2 text-teal"
                    : "bg-panel px-3 py-2 text-muted"
                }
              >
                XP
              </button>
              <button
                type="button"
                onClick={() => setMode("pct")}
                className={
                  mode === "pct"
                    ? "bg-teal/20 px-3 py-2 text-teal"
                    : "border-l border-line bg-panel px-3 py-2 text-muted"
                }
              >
                %
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <span className="text-sm text-muted">Rested XP</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={rested}
              onChange={(e) => setRested(Number(e.target.value) || 0)}
              className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-parchment outline-none focus:border-gold/50"
              aria-label="Rested XP pool"
            />
            <button
              type="button"
              onClick={() => setRested(0)}
              className="rounded-lg border border-teal/40 px-4 py-2 text-xs text-teal transition-colors hover:bg-teal/10"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="panel p-5">
        {level === MAX_LEVEL ? (
          <p className="text-sm text-parchment">
            Level {MAX_LEVEL} is the cap — there is no next level to calculate.
          </p>
        ) : (
          <>
            <p className="text-sm text-teal md:text-base">
              To reach level {level + 1} you still need{" "}
              <span className="font-semibold">{formatNumber(remaining)}</span> XP
            </p>
            <p className="mt-1 text-xs text-muted">
              Level {level} progress: {formatNumber(progressXp)} /{" "}
              {formatNumber(levelXp)} XP
            </p>
            <div className="relative mt-3 h-5 overflow-hidden rounded-md border border-line bg-deep">
              <div
                className="h-full bg-gradient-to-r from-teal/80 to-gold/80 transition-[width] duration-200"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0 calc(8.333% - 1px), rgba(5,8,15,.9) calc(8.333% - 1px) calc(8.333%))",
                }}
                aria-hidden="true"
              />
              <span className="absolute inset-0 grid place-items-center text-[10px] text-parchment">
                {percent.toFixed(0)}%
              </span>
            </div>
          </>
        )}
      </section>

      {/* Tables */}
      {level < MAX_LEVEL && (
        <section className="panel p-5">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-line p-1 text-sm">
            <button
              type="button"
              onClick={() => setTab("kills")}
              className={
                tab === "kills"
                  ? "rounded-md bg-teal/20 py-2 text-teal"
                  : "rounded-md py-2 text-muted transition-colors hover:text-parchment"
              }
            >
              Kills
            </button>
            <button
              type="button"
              onClick={() => setTab("quests")}
              className={
                tab === "quests"
                  ? "rounded-md bg-teal/20 py-2 text-teal"
                  : "rounded-md py-2 text-muted transition-colors hover:text-parchment"
              }
            >
              Quests
            </button>
          </div>

          {tab === "kills" ? (
            <>
              <label className="mt-4 flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={food}
                  onChange={(e) => setFood(e.target.checked)}
                  className="size-4 accent-teal"
                />
                Well Fed (+5% XP)
              </label>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                      <th className="py-2 pr-4 font-medium">Mob level</th>
                      <th className="py-2 pr-4 font-medium">XP / kill</th>
                      <th className="py-2 pr-4 font-medium">Kills</th>
                      <th className="py-2 pr-4 font-medium">Elite XP</th>
                      <th className="py-2 font-medium">Elite kills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mobRows.map((row) => (
                      <tr key={row.mobLevel} className="border-b border-line/50 last:border-0">
                        <td className="py-2 pr-4 text-teal">{row.mobLevel}</td>
                        <td className="py-2 pr-4 text-parchment">{row.base}</td>
                        <td className="py-2 pr-4 text-parchment">{formatNumber(row.kills)}</td>
                        <td className="py-2 pr-4 text-parchment">{row.elite}</td>
                        <td className="py-2 text-parchment">{formatNumber(row.eliteKills)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Kill XP is 45 + 5 × level for an even-level mob: higher mobs add
                5% per level, lower mobs lose XP as the level gap widens. Rested
                XP doubles kill XP until the pool runs out. The +5% well-fed
                bonus applies to kill XP only.
              </p>
            </>
          ) : (
            <>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                      <th className="py-2 pr-4 font-medium">Quest level</th>
                      <th className="py-2 pr-4 font-medium">XP / quest</th>
                      <th className="py-2 font-medium">Quests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questRows.map((row) => (
                      <tr key={row.questLevel} className="border-b border-line/50 last:border-0">
                        <td className="py-2 pr-4 text-teal">{row.questLevel}</td>
                        <td className="py-2 pr-4 text-parchment">{formatNumber(row.xp)}</td>
                        <td className="py-2 text-parchment">{formatNumber(row.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Quest XP uses typical values per quest level. Quests 6+ levels
                below you give reduced XP (20% less per level, down to 10%), and
                rested XP does not apply to quest rewards. Individual quests can
                differ from the typical value.
              </p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
