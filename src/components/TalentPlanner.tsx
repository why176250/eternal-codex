"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

const MIN_LEVEL = 10;
const MAX_LEVEL = 60;

type SavedBuild = {
  id: string;
  name: string;
  url: string;
  className: string;
  level: number;
  points: number;
  savedAt: string;
};

type TalentClass = ForeverTalentClass;
type Talent = TalentClass["trees"][number]["talents"][number];

export function TalentPlanner({ classes }: { classes: TalentClass[] }) {
  const [active, setActive] = useState(0);
  const [level, setLevel] = useState(MAX_LEVEL);
  const [points, setPoints] = useState<Record<string, number>>({});
  const [buildName, setBuildName] = useState("");
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [buildLink, setBuildLink] = useState("");
  const [communityBuild, setCommunityBuild] = useState<{
    name: string;
    description: string;
    author: string;
  } | null>(null);

  const current = classes[active];
  const accent = CLASS_ACCENT[current.className] ?? "#e3bd78";
  const maxPoints = Math.max(1, level - (MIN_LEVEL - 1));

  const total = useMemo(
    () => Object.values(points).reduce((sum, value) => sum + value, 0),
    [points],
  );

  function keyFor(treeIndex: number, talentId: number) {
    return `${current.classId}-${treeIndex}-${talentId}`;
  }

  function spentInTree(treeIndex: number) {
    return current.trees[treeIndex].talents.reduce(
      (sum, talent) => sum + (points[keyFor(treeIndex, talent.id)] ?? 0),
      0,
    );
  }

  function findTalent(treeIndex: number, talentId: number): Talent | undefined {
    return current.trees[treeIndex].talents.find((t) => t.id === talentId);
  }

  function requirementFor(treeIndex: number, talent: Talent) {
    const tierNeed = 5 * (talent.tierId - 1);
    if (spentInTree(treeIndex) < tierNeed) {
      return `Requires ${tierNeed} points in ${
        current.trees[treeIndex].nameEn || current.trees[treeIndex].name
      }`;
    }
    if (talent.prereqTalentId) {
      const prereq = findTalent(treeIndex, talent.prereqTalentId);
      const have = points[keyFor(treeIndex, talent.prereqTalentId)] ?? 0;
      if (have < (talent.prereqRank ?? 0)) {
        return `Requires ${prereq?.nameEn || prereq?.name} (${have}/${
          talent.prereqRank
        })`;
      }
    }
    return null;
  }

  function canAdd(treeIndex: number, talent: Talent) {
    const value = points[keyFor(treeIndex, talent.id)] ?? 0;
    if (value >= talent.maxRanks) return false;
    if (total >= maxPoints) return false;
    return requirementFor(treeIndex, talent) === null;
  }

  function sanitize(next: Record<string, number>) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let treeIndex = 0; treeIndex < current.trees.length; treeIndex++) {
        const tree = current.trees[treeIndex];
        let treeTotal = tree.talents.reduce(
          (sum, talent) => sum + (next[keyFor(treeIndex, talent.id)] ?? 0),
          0,
        );
        for (const talent of tree.talents) {
          const key = keyFor(treeIndex, talent.id);
          const value = next[key] ?? 0;
          if (!value) continue;
          const tierNeed = 5 * (talent.tierId - 1);
          let valid = treeTotal >= tierNeed;
          if (valid && talent.prereqTalentId) {
            valid =
              (next[keyFor(treeIndex, talent.prereqTalentId)] ?? 0) >=
              (talent.prereqRank ?? 0);
          }
          if (!valid) {
            next[key] = 0;
            treeTotal -= value;
            changed = true;
          }
        }
      }
    }
    return next;
  }

  function addPoint(treeIndex: number, talentId: number) {
    const talent = findTalent(treeIndex, talentId);
    if (!talent || !canAdd(treeIndex, talent)) return;
    const key = keyFor(treeIndex, talentId);
    setPoints((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  }

  function removePoint(treeIndex: number, talentId: number) {
    const key = keyFor(treeIndex, talentId);
    setPoints((prev) => {
      const value = prev[key] ?? 0;
      if (value <= 0) return prev;
      const next = { ...prev, [key]: value - 1 };
      return sanitize(next);
    });
  }

  function resetTree(treeIndex: number) {
    setPoints((prev) => {
      const next = { ...prev };
      for (const talent of current.trees[treeIndex].talents) {
        delete next[keyFor(treeIndex, talent.id)];
      }
      return next;
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("eversixty:talent-builds:v1");
      if (raw) setSavedBuilds(JSON.parse(raw) as SavedBuild[]);
    } catch {
      // Ignore malformed local storage.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const buildName = params.get("buildName");
    if (buildName) {
      setCommunityBuild({
        name: buildName,
        description: params.get("buildDesc") ?? "",
        author: params.get("buildAuthor") ?? "",
      });
    }
    const raw = params.get("b");
    if (!raw) return;
    const [classId, rest] = raw.split(":");
    const index = classes.findIndex((cls) => String(cls.classId) === classId);
    if (index < 0) return;
    const lvl = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Number(params.get("lvl")) || MAX_LEVEL));
    setLevel(lvl);
    if (rest) {
      const next: Record<string, number> = {};
      for (const pair of rest.split(",")) {
        const [talentId, rankRaw] = pair.split(".");
        const rank = Math.max(0, Number(rankRaw) || 0);
        const treeIndex = classes[index].trees.findIndex((tree) =>
          tree.talents.some((t) => t.id === Number(talentId)),
        );
        if (treeIndex < 0 || rank <= 0) continue;
        const talent = classes[index].trees[treeIndex].talents.find(
          (t) => t.id === Number(talentId),
        );
        if (!talent) continue;
        next[`${classId}-${treeIndex}-${talentId}`] = Math.min(rank, talent.maxRanks);
      }
      setActive(index);
      setPoints(next);
    } else {
      setActive(index);
      setPoints({});
    }
  }, [classes]);

  useEffect(() => {
    setBuildLink(buildUrl());
  }, [points, level, active]);

  function buildUrl() {
    const pairs = Object.entries(points)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => {
        const [, , talentId] = key.split("-");
        return `${talentId}.${value}`;
      });
    const origin = typeof window === "undefined" ? "https://www.eversixty.com" : window.location.origin;
    const pathname = typeof window === "undefined" ? "/tools/build" : window.location.pathname;
    return `${origin}${pathname}?b=${current.classId}:${pairs.join(
      ",",
    )}&lvl=${level}`;
  }

  function saveBuild() {
    const url = buildUrl();
    const entry: SavedBuild = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: buildName.trim() || `${current.className} ${new Date().toLocaleDateString("en-US")}`,
      url,
      className: current.className,
      level,
      points: total,
      savedAt: new Date().toISOString(),
    };
    const next = [entry, ...savedBuilds].slice(0, 30);
    setSavedBuilds(next);
    try {
      window.localStorage.setItem("eversixty:talent-builds:v1", JSON.stringify(next));
    } catch {
      // Local storage can be unavailable in private modes.
    }
    setBuildName("");
  }

  function deleteBuild(id: string) {
    const next = savedBuilds.filter((build) => build.id !== id);
    setSavedBuilds(next);
    try {
      window.localStorage.setItem("eversixty:talent-builds:v1", JSON.stringify(next));
    } catch {
      // Ignore storage errors.
    }
  }

  function copyBuildUrl() {
    const url = buildUrl();
    const done = () => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => window.prompt("Copy your build link:", url));
    } else {
      window.prompt("Copy your build link:", url);
    }
  }

  function copyBuildText() {
    const text = `${buildName.trim() || `${current.className} build`}\n${buildUrl()}`;
    const done = () => {
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => window.prompt("Copy your build:", text));
    } else {
      window.prompt("Copy your build:", text);
    }
  }

  function changeLevel(next: number) {
    const clamped = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, next));
    if (clamped - (MIN_LEVEL - 1) < total) return;
    setLevel(clamped);
  }

  const maxTier = Math.max(
    ...current.trees.flatMap((tree) => tree.talents.map((t) => t.tierId)),
  );
  const rowH = 100 / maxTier;
  const colW = 25;

  return (
    <div>
      {communityBuild ? (
        <div className="panel mb-4 p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Community build</p>
              <h2 className="display mt-1 text-xl text-parchment">{communityBuild.name}</h2>
              {communityBuild.author ? (
                <p className="mt-1 text-xs text-muted">by {communityBuild.author}</p>
              ) : null}
            </div>
            <Link
              href="/tools/builds"
              className="text-xs text-gold/80 underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
            >
              ← Talent Hall
            </Link>
          </div>
          {communityBuild.description ? (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              {communityBuild.description}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Class banner */}
      <div
        className="relative overflow-hidden rounded-xl border border-line"
        style={{
          background: `radial-gradient(120% 140% at 85% 0%, ${accent}33, transparent 55%), linear-gradient(180deg, #0d1729, #05080f)`,
        }}
      >
        <div className="relative flex flex-wrap items-end justify-between gap-4 px-5 py-5">
          <div>
            <p className="eyebrow">Talent calculator</p>
            <h2 className="display mt-1 text-3xl" style={{ color: accent }}>
              {current.className}
            </h2>
            <p className="text-xs text-muted">
              {current.trees.length} trees · Level {level}
            </p>
          </div>
          <div className="rounded-lg border border-line/70 bg-abyss/60 px-4 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted">
              Points left
            </p>
            <p className="display text-2xl text-parchment">{maxPoints - total}</p>
          </div>
        </div>
      </div>

      {/* Class tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
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
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors " +
                (isActive
                  ? "border-gold/50 bg-gold/10 text-gold-soft"
                  : "border-line text-muted hover:border-gold/40 hover:text-parchment")
              }
            >
              <img
                src={`/classes/icons/${cls.classSlug}.jpg`}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded border border-line/70"
              />
              {cls.className}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted">Level</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => changeLevel(level - 1)}
              disabled={level <= MIN_LEVEL || maxPoints - 1 < total}
              className="grid size-8 place-items-center rounded-md border border-line text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment disabled:opacity-40"
              aria-label="Decrease level"
            >
              −
            </button>
            <input
              type="number"
              min={MIN_LEVEL}
              max={MAX_LEVEL}
              value={level}
              onChange={(event) => changeLevel(Number(event.target.value) || MAX_LEVEL)}
              className="w-16 rounded-md border border-line bg-deep px-2 py-1 text-center text-sm text-parchment outline-none focus:border-gold/50"
              aria-label="Character level"
            />
            <button
              type="button"
              onClick={() => changeLevel(level + 1)}
              disabled={level >= MAX_LEVEL}
              className="grid size-8 place-items-center rounded-md border border-line text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment disabled:opacity-40"
              aria-label="Increase level"
            >
              +
            </button>
          </div>
          <span className="text-muted">
            Points: <span className="text-parchment">{total}</span> / {maxPoints}
          </span>
          <span className="hidden text-xs text-muted/70 sm:inline">
            Left click to add · right click to remove
          </span>
        </div>
      </div>

      {/* Trees */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {current.trees.map((tree, treeIndex) => {
          const spent = spentInTree(treeIndex);
          const lines = tree.talents
            .filter((talent) => talent.prereqTalentId)
            .map((talent) => {
              const source = tree.talents.find((t) => t.id === talent.prereqTalentId);
              if (!source) return null;
              const x1 = (source.colIndex - 0.5) * colW;
              const x2 = (talent.colIndex - 0.5) * colW;
              const y1 = (source.tierId - 0.5) * rowH + rowH * 0.32;
              const y2 = (talent.tierId - 0.5) * rowH - rowH * 0.32;
              return {
                key: `${source.id}-${talent.id}`,
                x1,
                y1,
                x2,
                y2: Math.max(y2, y1 + 0.5),
              };
            })
            .filter(Boolean);

          return (
            <section
              key={tree.tabId}
              className="overflow-visible rounded-xl border border-line p-4"
              style={{
                borderTopColor: accent,
                borderTopWidth: 3,
                backgroundImage: `linear-gradient(180deg, ${accent}0A, rgba(5,8,15,0.25) 26%, rgba(5,8,15,0.62) 68%, rgba(5,8,15,0.86)), url(/talents/bg/${current.classId}-${treeIndex}.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            >
              <header className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-md border bg-deep"
                    style={{ borderColor: `${accent}66` }}
                  >
                    {tree.icon ? (
                      <img
                        src={`/talents/icons/${tree.icon}.jpg`}
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 rounded"
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
                <div className="flex items-center gap-2">
                  <span
                    className="shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
                    style={{ borderColor: `${accent}55`, color: accent }}
                  >
                    {spent} / {maxPoints}
                  </span>
                  <button
                    type="button"
                    onClick={() => resetTree(treeIndex)}
                    className="rounded border border-line px-1.5 py-0.5 text-[10px] text-muted transition-colors hover:border-gold/40 hover:text-parchment"
                  >
                    Reset
                  </button>
                </div>
              </header>

              <div className="relative mt-4">
                {lines.length > 0 ? (
                  <svg
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {lines.map((line) =>
                      line ? (
                        <line
                          key={line.key}
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke={accent}
                          strokeOpacity="0.4"
                          strokeWidth="1.6"
                          vectorEffect="non-scaling-stroke"
                        />
                      ) : null,
                    )}
                  </svg>
                ) : null}

                <div
                  className="relative z-10 grid grid-cols-4 gap-x-2.5 gap-y-3"
                  style={{ gridTemplateRows: `repeat(${maxTier}, minmax(0, auto))` }}
                >
                  {tree.talents.map((talent) => {
                    const value = points[keyFor(treeIndex, talent.id)] ?? 0;
                    const requirement = requirementFor(treeIndex, talent);
                    const locked = requirement !== null;
                    const maxed = value >= talent.maxRanks;
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
                          onClick={() => addPoint(treeIndex, talent.id)}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            removePoint(treeIndex, talent.id);
                          }}
                          disabled={locked || maxed}
                          aria-label={`${talent.nameEn || talent.name}: add a point`}
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
                            src={`/talents/icons/${talent.icon}.jpg`}
                            alt=""
                            width={52}
                            height={52}
                            className={
                              "size-[52px] rounded border-2 " +
                              (value > 0
                                ? "border-gold/90 shadow-[0_0_14px_rgba(227,189,120,0.35)]"
                                : "border-line/80")
                            }
                          />
                          <span
                            className={
                              "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded px-1.5 text-[10px] leading-4 " +
                              (value > 0
                                ? "bg-gold text-abyss"
                                : "bg-abyss/90 text-muted")
                            }
                          >
                            {value}/{talent.maxRanks}
                          </span>
                          {value > 0 ? (
                            <span
                              className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full border border-line bg-abyss text-[10px] text-muted hover:text-parchment"
                              onClick={(event) => {
                                event.stopPropagation();
                                removePoint(treeIndex, talent.id);
                              }}
                              role="button"
                              aria-label={`Remove a point from ${talent.nameEn || talent.name}`}
                            >
                              −
                            </span>
                          ) : null}
                        </button>

                        <div
                          className={`pointer-events-none absolute top-full z-50 mt-3 w-80 ${tooltipSide} rounded-lg border border-line bg-panel p-4 text-left opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100`}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={`/talents/icons/${talent.icon}.jpg`}
                              alt=""
                              width={40}
                              height={40}
                              className="mt-0.5 size-10 shrink-0 rounded border border-line"
                            />
                            <div>
                              <p className="text-sm font-medium text-parchment">
                                {talent.nameEn || talent.name}
                              </p>
                              <p className="text-xs text-muted">{talent.name}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-xs" style={{ color: accent }}>
                            Rank {value} / {talent.maxRanks}
                          </p>
                          {rankText ? (
                            <p className="mt-2 text-xs leading-relaxed text-muted">
                              {rankText}
                            </p>
                          ) : null}
                          {rank?.zh && rank.zh !== rankText ? (
                            <p className="mt-1 text-[11px] leading-relaxed text-muted/70">
                              {rank.zh}
                            </p>
                          ) : null}
                          {requirement ? (
                            <p className="mt-2 text-[11px] text-red-300/90">
                              {requirement}
                            </p>
                          ) : null}
                          {talent.reqText ? (
                            <p className="mt-2 text-[11px] text-gold/90">
                              Requires: {talent.reqText}
                            </p>
                          ) : null}
                          {talent.classicStatus &&
                          talent.classicStatus !== "unchanged" ? (
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
            </section>
          );
        })}
      </div>

      <section className="panel mt-5 p-4 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="eyebrow">Your talent builds</p>
            <h2 className="display mt-1 text-xl text-parchment">Save and share this build</h2>
          </div>
          <span className="text-[11px] text-muted">Stored in this browser</span>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.3fr)_auto]">
          <input
            value={buildName}
            onChange={(event) => setBuildName(event.target.value)}
            placeholder="Name this build"
            className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={saveBuild}
            className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft transition-colors hover:bg-gold/[0.1]"
          >
            Save build
          </button>
          <input
            readOnly
            value={buildLink}
            aria-label="Build link"
            className="min-w-0 rounded-lg border border-line bg-deep px-3 py-2 text-xs text-muted"
          />
          <button
            type="button"
            onClick={copyBuildUrl}
            className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
          >
            {linkCopied ? "Copied" : "Copy link"}
          </button>
        </div>

        <button type="button" onClick={copyBuildText} className="mt-2 text-[11px] text-muted underline-offset-4 hover:text-parchment hover:underline">
          {textCopied ? "Copied as text" : "Copy as text"}
        </button>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-parchment">Saved builds <span className="text-muted">{savedBuilds.length}</span></p>
          {savedBuilds.length > 0 ? <button type="button" onClick={() => { setSavedBuilds([]); window.localStorage.removeItem("eversixty:talent-builds:v1"); }} className="text-[11px] text-muted hover:text-parchment">Clear all</button> : null}
        </div>
        {savedBuilds.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-line/70 p-4 text-xs text-muted">No saved builds yet. Name a build and hit Save build.</p>
        ) : (
          <div className="mt-3 divide-y divide-line/50">
            {savedBuilds.map((build) => (
              <div key={build.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-parchment">{build.name}</p>
                  <p className="mt-0.5 text-[10px] text-muted">{build.className} · Level {build.level} · {build.points} points · {new Date(build.savedAt).toLocaleDateString("en-US")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={build.url} className="text-xs text-gold/85 hover:text-gold-soft">Open</Link>
                  <button type="button" onClick={() => deleteBuild(build.id)} className="text-xs text-muted hover:text-red-300">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Lines connect a talent to its prerequisite. Tier unlocks follow the
        5-point rule. Level sets your talent budget (level − 9 points); lowering
        the level below your spent points is blocked.
      </p>
    </div>
  );
}
