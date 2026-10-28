"use client";

import { useMemo, useState } from "react";
import {
  eliteXp,
  formatDuration,
  formatNumber,
  killsNeeded,
  MAX_LEVEL,
  mobXp,
  totalXpTo,
  xpToNext,
} from "@/lib/xp";

type Mode = "xp" | "pct";

export function XpCalculator() {
  const [level, setLevel] = useState(35);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<Mode>("xp");
  const [rested, setRested] = useState(false);
  const [questXp, setQuestXp] = useState(0);
  const [xpPerHour, setXpPerHour] = useState(20000);

  const levelXp = xpToNext(level);
  const progressXp =
    mode === "pct"
      ? Math.round((levelXp * Math.min(Math.max(progress, 0), 100)) / 100)
      : Math.min(Math.max(progress, 0), levelXp);
  const remaining = Math.max(0, levelXp - progressXp);
  const toSixty = Math.max(
    0,
    totalXpTo(MAX_LEVEL) - totalXpTo(level) - progressXp,
  );

  const mobRows = useMemo(() => {
    const rows = [];
    for (let m = Math.max(1, level - 5); m <= Math.min(MAX_LEVEL, level + 4); m++) {
      const base = mobXp(level, m);
      const perKill = rested ? base * 2 : base;
      const elite = eliteXp(level, m);
      const elitePerKill = rested ? elite * 2 : elite;
      rows.push({
        mobLevel: m,
        base,
        perKill,
        kills: killsNeeded(remaining, perKill),
        elitePerKill,
        eliteKills: killsNeeded(remaining, elitePerKill),
      });
    }
    return rows;
  }, [level, remaining, rested]);

  const quests = questXp > 0 ? Math.ceil(remaining / questXp) : 0;

  function changeLevel(next: number) {
    const clamped = Math.min(MAX_LEVEL, Math.max(1, next));
    setLevel(clamped);
    setProgress(0);
  }

  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <div className="grid gap-4 sm:grid-cols-[7rem_1fr] sm:items-center">
          <span className="text-sm text-muted">Character level</span>
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
              onChange={(event) => changeLevel(Number(event.target.value) || 1)}
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
            {level >= MAX_LEVEL ? (
              <span className="text-xs text-teal">Max level</span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[7rem_1fr] sm:items-center">
          <span className="text-sm text-muted">Current progress</span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={0}
              max={mode === "pct" ? 100 : levelXp}
              value={progress}
              disabled={level >= MAX_LEVEL}
              onChange={(event) => setProgress(Number(event.target.value) || 0)}
              className="min-w-0 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-parchment outline-none focus:border-gold/50 disabled:opacity-40"
              aria-label="Current progress"
            />
            <div className="flex overflow-hidden rounded-lg border border-line text-xs">
              {(["xp", "pct"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setMode(option);
                    setProgress(0);
                  }}
                  className={
                    "px-3 py-2 transition-colors " +
                    (mode === option
                      ? "bg-gold/15 text-gold-soft"
                      : "text-muted hover:text-parchment")
                  }
                >
                  {option === "xp" ? "XP" : "%"}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted">
              of {formatNumber(levelXp)} XP
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input
              type="checkbox"
              checked={rested}
              onChange={(event) => setRested(event.target.checked)}
              className="size-4 accent-[#e3bd78]"
            />
            Rested (2× mob XP)
          </label>
          <label className="flex items-center gap-2 text-muted">
            XP / hour
            <input
              type="number"
              min={0}
              step={1000}
              value={xpPerHour}
              onChange={(event) => setXpPerHour(Number(event.target.value) || 0)}
              className="w-24 rounded-lg border border-line bg-deep px-2 py-1 text-parchment outline-none focus:border-gold/50"
              aria-label="XP per hour"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "XP to next level", value: formatNumber(levelXp), accent: "#e3bd78" },
          { label: "Remaining this level", value: formatNumber(remaining), accent: "#6fd5c5" },
          { label: "To level 60", value: formatNumber(toSixty), accent: "#c9a8ff" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="panel stat-card p-5"
            style={{ "--accent": stat.accent } as React.CSSProperties}
          >
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted">
              <span className="size-1.5 rounded-full" style={{ background: stat.accent }} />
              {stat.label}
            </p>
            <p className="display mt-2 text-3xl text-parchment">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line/60 p-5">
          <div>
            <p className="eyebrow">Kills</p>
            <h2 className="display mt-1 text-xl text-parchment">
              Mobs until the next level
            </h2>
          </div>
          <p className="text-xs text-muted">
            {rested
              ? "Rested applied to every kill; the rest pool is not modelled."
              : "Classic mob XP formula, player-level base."}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-deep/80 text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-5 py-2 font-normal">Mob level</th>
                <th className="px-3 py-2 text-right font-normal">XP / kill</th>
                <th className="px-3 py-2 text-right font-normal">Kills</th>
                <th className="px-3 py-2 text-right font-normal">Elite XP</th>
                <th className="px-5 py-2 text-right font-normal">Elite kills</th>
              </tr>
            </thead>
            <tbody className="table-zebra">
              {mobRows.map((row) => (
                <tr key={row.mobLevel} className="border-t border-line/30">
                  <td className="px-5 py-2 text-parchment">
                    {row.mobLevel}
                    {row.mobLevel === level ? (
                      <span className="ml-2 text-[10px] text-teal">same level</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-right text-muted">
                    {row.perKill > 0 ? formatNumber(row.perKill) : "0"}
                  </td>
                  <td className="px-3 py-2 text-right text-parchment">
                    {Number.isFinite(row.kills) ? formatNumber(row.kills) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-muted">
                    {row.elitePerKill > 0 ? formatNumber(row.elitePerKill) : "0"}
                  </td>
                  <td className="px-5 py-2 text-right text-parchment">
                    {Number.isFinite(row.eliteKills)
                      ? formatNumber(row.eliteKills)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Quests</p>
            <h2 className="display mt-1 text-xl text-parchment">Quest turn-ins</h2>
          </div>
          <p className="text-xs text-muted">
            Quest XP is hand-tuned in Classic; enter the value from your quest.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted">
            XP per quest
            <input
              type="number"
              min={0}
              step={50}
              value={questXp}
              onChange={(event) => setQuestXp(Number(event.target.value) || 0)}
              className="ml-2 w-28 rounded-lg border border-line bg-deep px-2 py-1.5 text-parchment outline-none focus:border-gold/50"
              aria-label="XP per quest"
            />
          </label>
          <span className="text-sm text-parchment">
            {quests > 0 ? `${formatNumber(quests)} quests` : "Enter a value"}
          </span>
          <span className="text-xs text-muted">
            {quests > 0
              ? `≈ ${formatDuration(remaining / xpPerHour)} at your XP/hour`
              : ""}
          </span>
        </div>
      </section>

      <section className="panel p-5">
        <p className="eyebrow">Time</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
          <span className="text-muted">
            This level:{" "}
            <span className="text-parchment">
              {formatDuration(remaining / xpPerHour)}
            </span>
          </span>
          <span className="text-muted">
            To 60:{" "}
            <span className="text-parchment">{formatDuration(toSixty / xpPerHour)}</span>
          </span>
          <span className="text-xs text-muted/70">
            Based on {formatNumber(xpPerHour)} XP/hour and no travel time.
          </span>
        </div>
      </section>

      <details className="panel p-5">
        <summary className="cursor-pointer text-sm text-parchment">
          Full 1–60 XP table
        </summary>
        <div className="mt-4 grid gap-x-8 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: MAX_LEVEL - 1 }, (_, index) => index + 1).map((lvl) => (
            <div
              key={lvl}
              className={
                "flex items-center justify-between border-b border-line/30 py-1 " +
                (lvl === level ? "text-gold-soft" : "text-muted")
              }
            >
              <span>{lvl}</span>
              <span>{formatNumber(xpToNext(lvl))}</span>
              <span className="text-muted/60">
                {formatNumber(totalXpTo(lvl + 1))} total
              </span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
