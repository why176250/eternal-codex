"use client";

import { useEffect, useMemo, useState } from "react";
import type { ForeverLegacy, ForeverLegacyNode } from "@/lib/forever";

const ACCENTS = ["#e3bd78", "#5fd0c0", "#a78bfa"];

type LegacyTree = ForeverLegacy["trees"][number];

export function LegacyPlanner({ data }: { data: ForeverLegacy }) {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [budget, setBudget] = useState(data.totalPoints);
  const [copied, setCopied] = useState(false);

  const total = useMemo(
    () => Object.values(points).reduce((sum, value) => sum + value, 0),
    [points],
  );

  function keyFor(treeIndex: number, nodeId: number) {
    return `${treeIndex}-${nodeId}`;
  }

  function spentInTree(treeIndex: number) {
    return data.trees[treeIndex].nodes.reduce(
      (sum, node) => sum + (points[keyFor(treeIndex, node.id)] ?? 0),
      0,
    );
  }

  function findNode(treeIndex: number, nodeId: number): ForeverLegacyNode | undefined {
    return data.trees[treeIndex].nodes.find((node) => node.id === nodeId);
  }

  function requirementFor(treeIndex: number, node: ForeverLegacyNode) {
    if (spentInTree(treeIndex) < node.gatePoints) {
      return `Requires ${node.gatePoints} points in ${data.trees[treeIndex].name}`;
    }
    return null;
  }

  function canAdd(treeIndex: number, node: ForeverLegacyNode) {
    const value = points[keyFor(treeIndex, node.id)] ?? 0;
    if (value >= node.maxRank) return false;
    if (total >= budget) return false;
    return requirementFor(treeIndex, node) === null;
  }

  function sanitize(next: Record<string, number>) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let treeIndex = 0; treeIndex < data.trees.length; treeIndex++) {
        const tree = data.trees[treeIndex];
        let treeTotal = tree.nodes.reduce(
          (sum, node) => sum + (next[keyFor(treeIndex, node.id)] ?? 0),
          0,
        );
        for (const node of tree.nodes) {
          const key = keyFor(treeIndex, node.id);
          const value = next[key] ?? 0;
          if (!value) continue;
          if (treeTotal < node.gatePoints) {
            next[key] = 0;
            treeTotal -= value;
            changed = true;
          }
        }
      }
    }
    return next;
  }

  function addPoint(treeIndex: number, nodeId: number) {
    const node = findNode(treeIndex, nodeId);
    if (!node || !canAdd(treeIndex, node)) return;
    const key = keyFor(treeIndex, nodeId);
    setPoints((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    setCopied(false);
  }

  function removePoint(treeIndex: number, nodeId: number) {
    const key = keyFor(treeIndex, nodeId);
    setPoints((prev) => {
      const value = prev[key] ?? 0;
      if (value <= 0) return prev;
      const next = { ...prev, [key]: value - 1 };
      return sanitize(next);
    });
    setCopied(false);
  }

  function buildUrl() {
    const parts = Object.entries(points)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => {
        const [treeIndex, nodeId] = key.split("-");
        return `${treeIndex}.${nodeId}.${value}`;
      });
    return `${window.location.origin}${window.location.pathname}?l=${parts.join(",")}&p=${budget}`;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("l");
    const p = Number(params.get("p"));
    if (p > 0) setBudget(Math.min(data.totalPoints, Math.max(0, p)));
    if (!raw) return;
    const next: Record<string, number> = {};
    for (const part of raw.split(",")) {
      const [treeIndex, nodeId, rankRaw] = part.split(".").map(Number);
      const tree = data.trees[treeIndex];
      if (!tree) continue;
      const node = tree.nodes.find((n) => n.id === nodeId);
      if (!node) continue;
      next[`${treeIndex}-${nodeId}`] = Math.min(Math.max(rankRaw, 0), node.maxRank);
    }
    setPoints(next);
  }, [data]);

  function copyBuild() {
    const url = buildUrl();
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => window.prompt("Copy build link:", url));
    } else {
      window.prompt("Copy build link:", url);
    }
  }

  const nextMilestone = data.milestones.find((m) => total < m.threshold);
  const progress = nextMilestone ? Math.min(100, (total / nextMilestone.threshold) * 100) : 100;

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-xl border border-line"
        style={{
          background:
            "radial-gradient(120% 150% at 85% 0%, rgba(227,189,120,0.18), transparent 55%), linear-gradient(180deg, #0d1729, #05080f)",
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-5">
          <div>
            <p className="eyebrow">Legacy progression</p>
            <h2 className="display mt-1 text-3xl text-gold-soft">
              Classic legacy
            </h2>
            <p className="text-xs text-muted">
              3 trees · {data.totalPoints} points earnable · {data.achievementCount} achievements
            </p>
          </div>
          <div className="rounded-lg border border-line/70 bg-abyss/60 px-4 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted">Points left</p>
            <p className="display text-2xl text-parchment">{budget - total}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted">Points available</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBudget((b) => Math.max(total, Math.max(0, b - 1)))}
              className="grid size-8 place-items-center rounded-md border border-line text-sm text-muted hover:border-gold/40 hover:text-parchment"
              aria-label="Decrease legacy points"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={data.totalPoints}
              value={budget}
              onChange={(event) => {
                const next = Math.min(data.totalPoints, Math.max(total, Number(event.target.value) || 0));
                setBudget(next);
              }}
              className="w-16 rounded-md border border-line bg-deep px-2 py-1 text-center text-sm text-parchment outline-none focus:border-gold/50"
              aria-label="Legacy points available"
            />
            <button
              type="button"
              onClick={() => setBudget((b) => Math.min(data.totalPoints, b + 1))}
              className="grid size-8 place-items-center rounded-md border border-line text-sm text-muted hover:border-gold/40 hover:text-parchment"
              aria-label="Increase legacy points"
            >
              +
            </button>
          </div>
          <span className="text-muted">
            Spent: <span className="text-parchment">{total}</span> / {budget}
          </span>
          <span className="hidden text-xs text-muted/70 sm:inline">
            Left click to add · right click to remove
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyBuild}
            className="rounded-md border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-gold-soft hover:bg-gold/10"
          >
            {copied ? "Link copied" : "Copy build link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPoints({});
              setCopied(false);
            }}
            className="rounded-md border border-line px-3 py-1 text-xs text-muted hover:border-gold/40 hover:text-parchment"
          >
            Reset all
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {data.trees.map((tree, treeIndex) => {
          const spent = spentInTree(treeIndex);
          const accent = ACCENTS[treeIndex % ACCENTS.length];
          const maxRow = Math.max(...tree.nodes.map((n) => n.row));
          return (
            <section
              key={tree.ord}
              className="overflow-visible rounded-xl border border-line p-4"
              style={{
                borderTopColor: accent,
                borderTopWidth: 3,
                background: `linear-gradient(180deg, ${accent}14, rgba(5,8,15,0.4) 45%, rgba(5,8,15,0.9))`,
              }}
            >
              <header className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-md border bg-deep"
                    style={{ borderColor: `${accent}66` }}
                  >
                    <img
                      src={`/legacy/icons/${tree.icon}.jpg`}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-parchment">{tree.name}</p>
                    <p className="truncate text-[10px] text-muted">{tree.nameZh} · {tree.sub}</p>
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
                  style={{ borderColor: `${accent}55`, color: accent }}
                >
                  {spent} / {budget}
                </span>
              </header>

              <div
                className="relative mt-4 grid grid-cols-3 gap-x-2.5 gap-y-3"
                style={{ gridTemplateRows: `repeat(${maxRow}, minmax(0, auto))` }}
              >
                {tree.nodes.map((node) => {
                  const value = points[keyFor(treeIndex, node.id)] ?? 0;
                  const requirement = requirementFor(treeIndex, node);
                  const locked = requirement !== null;
                  const maxed = value >= node.maxRank;
                  const rankEn = node.descEnList[Math.max(value - 1, 0)] || node.descEn;
                  const rankZh = node.descCnList[Math.max(value - 1, 0)] || node.descCn;
                  const active = value > 0;

                  return (
                    <div
                      key={node.id}
                      style={{ gridColumn: node.col, gridRow: node.row }}
                      className="group relative flex flex-col items-center"
                    >
                      <button
                        type="button"
                        onClick={() => addPoint(treeIndex, node.id)}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          removePoint(treeIndex, node.id);
                        }}
                        disabled={locked || maxed}
                        aria-label={`${node.name || node.nameZh}: add a point`}
                        aria-disabled={locked || maxed}
                        className={
                          "relative rounded-md transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 " +
                          (locked
                            ? "cursor-not-allowed opacity-40 grayscale"
                            : maxed
                              ? "cursor-default"
                              : "hover:scale-105")
                        }
                      >
                        <img
                          src={`/legacy/icons/${node.icon}.jpg`}
                          alt=""
                          width={52}
                          height={52}
                          className={
                            "size-[52px] rounded border-2 " +
                            (active
                              ? "border-gold/90 shadow-[0_0_14px_rgba(227,189,120,0.35)]"
                              : "border-line/80")
                          }
                        />
                        <span
                          className={
                            "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded px-1.5 text-[10px] leading-4 " +
                            (active ? "bg-gold text-abyss" : "bg-abyss/90 text-muted")
                          }
                        >
                          {value}/{node.maxRank}
                        </span>
                        {value > 0 ? (
                          <span
                            className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full border border-line bg-abyss text-[10px] text-muted hover:text-parchment"
                            onClick={(event) => {
                              event.stopPropagation();
                              removePoint(treeIndex, node.id);
                            }}
                            role="button"
                            aria-label={`Remove a point from ${node.name || node.nameZh}`}
                          >
                            −
                          </span>
                        ) : null}
                      </button>

                      <div
                        className={`pointer-events-none absolute top-full z-50 mt-3 w-80 ${
                          node.col <= 1 ? "left-0" : node.col >= 3 ? "right-0" : "left-1/2 -translate-x-1/2"
                        } rounded-lg border border-line bg-panel p-4 text-left opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={`/legacy/icons/${node.icon}.jpg`}
                            alt=""
                            width={40}
                            height={40}
                            className="mt-0.5 size-10 shrink-0 rounded border border-line"
                          />
                          <div>
                            <p className="text-sm font-medium text-parchment">
                              {node.name || node.nameZh}
                            </p>
                            <p className="text-xs text-muted">{node.nameZh}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs" style={{ color: accent }}>
                          Rank {value} / {node.maxRank}
                        </p>
                        {rankEn ? (
                          <p className="mt-2 text-xs leading-relaxed text-muted">{rankEn}</p>
                        ) : null}
                        {rankZh && rankZh !== rankEn ? (
                          <p className="mt-1 text-[11px] leading-relaxed text-muted/70">{rankZh}</p>
                        ) : null}
                        {node.cdMs > 0 ? (
                          <p className="mt-2 text-[10px] text-gold/80">
                            Cooldown: {Math.round(node.cdMs / 3600000)}h
                          </p>
                        ) : null}
                        {requirement ? (
                          <p className="mt-2 text-[11px] text-red-300/90">{requirement}</p>
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

      <div className="panel mt-6 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Progress track</p>
            <h3 className="display mt-1 text-xl text-parchment">
              {nextMilestone
                ? `${nextMilestone.threshold - total} points to the next reward`
                : "All track rewards unlocked"}
            </h3>
          </div>
          <p className="text-xs text-muted">
            {total} / {data.totalPoints} points spent
          </p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.milestones.map((milestone) => {
            const unlocked = total >= milestone.threshold;
            return (
              <div
                key={milestone.threshold}
                className={
                  "flex items-center gap-3 rounded-lg border p-3 " +
                  (unlocked
                    ? "border-gold/40 bg-gold/5"
                    : "border-line/70 bg-deep/40 opacity-60")
                }
              >
                <img
                  src={`/legacy/icons/${milestone.icon}.jpg`}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded border border-line"
                />
                <div className="min-w-0">
                  <p className="text-sm text-parchment">
                    {milestone.name || milestone.nameZh}
                  </p>
                  {milestone.name ? (
                    <p className="truncate text-[11px] text-muted">{milestone.nameZh}</p>
                  ) : null}
                  <p className="mt-0.5 text-[11px] text-muted">
                    {milestone.threshold} points
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Each tree gates deeper nodes behind points spent in that tree. Refunding
        a point also refunds anything that becomes illegal. Legacy data imported
        from the Blue Hermit (蓝色隐士) community dataset; verify in-game before
        committing points.
      </p>
    </div>
  );
}
