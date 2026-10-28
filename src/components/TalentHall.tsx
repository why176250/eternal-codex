"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type TalentHallBuild = {
  id: number;
  classId: number;
  className: string;
  classSlug: string;
  specName: string;
  specIcon: string;
  name: string;
  owner: string;
  mode: string;
  spentPoints: string;
  likes: number;
  favorites: number;
  comments: number;
  updatedAt: string;
  description: string;
  nameEn?: string;
  descriptionEn?: string;
  talentSelections?: Record<string, number>;
};

type RankingRow = {
  rank: number | null;
  nickname: string;
  realm: string;
  talentIndex: number;
  buildCount: number;
};

type SpecRow = {
  rank: number | null;
  className: string;
  classSlug: string;
  specName: string;
  specIcon: string;
  count: number;
};

type Props = {
  builds: TalentHallBuild[];
  ranking: RankingRow[];
  specRanking: SpecRow[];
  treeNames: Record<string, string[]>;
};

const CLASS_EN: Record<string, string> = {
  "战士": "Warrior",
  "圣骑士": "Paladin",
  "猎人": "Hunter",
  "潜行者": "Rogue",
  "牧师": "Priest",
  "萨满祭司": "Shaman",
  "法师": "Mage",
  "术士": "Warlock",
  "德鲁伊": "Druid",
};

const SPEC_EN: Record<string, string> = {
  "武器": "Arms",
  "狂怒": "Fury",
  "狂暴": "Fury",
  "防护": "Protection",
  "神圣": "Holy",
  "惩戒": "Retribution",
  "兽王": "Beast Mastery",
  "射击": "Marksmanship",
  "生存": "Survival",
  "刺杀": "Assassination",
  "战斗": "Combat",
  "敏锐": "Subtlety",
  "戒律": "Discipline",
  "暗影": "Shadow",
  "元素": "Elemental",
  "增强": "Enhancement",
  "恢复": "Restoration",
  "奥术": "Arcane",
  "火焰": "Fire",
  "冰霜": "Frost",
  "毁灭": "Destruction",
  "恶魔": "Demonology",
  "痛苦": "Affliction",
  "平衡": "Balance",
  "野性战斗": "Feral Combat",
};

const MODE_EN: Record<string, string> = {
  "PvE": "PvE",
  "PvP": "PvP",
  "通用": "General",
  "硬核": "Hardcore",
};

const MODES = ["PvE", "PvP", "通用", "硬核"];
const PAGE_SIZE = 24;

const classAccent: Record<string, string> = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  shaman: "#0070DE",
  mage: "#69CCF0",
  warlock: "#9482C9",
  druid: "#FF7D0A",
};

function classLabel(value: string) {
  return CLASS_EN[value] ?? value;
}

function specLabel(value: string) {
  return SPEC_EN[value] ?? value;
}

function modeLabel(value: string) {
  return MODE_EN[value] ?? value;
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function buildHref(build: TalentHallBuild) {
  const pairs = Object.entries(build.talentSelections ?? {})
    .map(([talentId, rank]) => `${talentId}.${rank}`)
    .join(",");
  return `/tools/build?b=${build.classId}:${pairs}&lvl=60`;
}

function parseSpent(value: string): number[] {
  return value
    .split("/")
    .map((part) => Number(part) || 0)
    .slice(0, 3);
}

function chipClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs transition-colors ${
    active
      ? "border-gold/60 bg-gold/[0.08] text-gold-soft"
      : "border-line/70 text-muted hover:border-line hover:text-parchment"
  }`;
}

export function TalentHall({ builds, ranking, specRanking, treeNames }: Props) {
  const [activeClass, setActiveClass] = useState("all");
  const [activeSpec, setActiveSpec] = useState("all");
  const [activeMode, setActiveMode] = useState("all");
  const [sort, setSort] = useState<"likes" | "new">("likes");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<TalentHallBuild | null>(null);

  const classes = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const build of builds) {
      const entry = map.get(build.classSlug) ?? {
        slug: build.classSlug,
        name: build.className,
        count: 0,
      };
      entry.count += 1;
      map.set(build.classSlug, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [builds]);

  const specs = useMemo(() => {
    const set = new Set<string>();
    for (const build of builds) {
      if (activeClass !== "all" && build.classSlug !== activeClass) continue;
      set.add(build.specName);
    }
    return Array.from(set);
  }, [builds, activeClass]);

  const filtered = useMemo(() => {
    let rows = builds;
    if (activeClass !== "all") rows = rows.filter((build) => build.classSlug === activeClass);
    if (activeSpec !== "all") rows = rows.filter((build) => build.specName === activeSpec);
    if (activeMode !== "all") rows = rows.filter((build) => build.mode === activeMode);
    if (sort === "new") {
      rows = [...rows].sort(
        (a, b) => (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0),
      );
    }
    return rows;
  }, [builds, activeClass, activeSpec, activeMode, sort]);

  const visible = filtered.slice(0, visibleCount);
  const treeLabels = selected ? treeNames[String(selected.classId)] ?? [] : [];
  const spent = selected ? parseSpent(selected.spentPoints) : [];

  function pickClass(slug: string) {
    setActiveClass(slug);
    setActiveSpec("all");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => pickClass("all")} className={chipClass(activeClass === "all")}>
          All classes
        </button>
        {classes.map((entry) => (
          <button
            key={entry.slug}
            type="button"
            onClick={() => pickClass(entry.slug)}
            className={`flex items-center gap-2 ${chipClass(activeClass === entry.slug)}`}
          >
            <img
              src={`/classes/icons/${entry.slug}.jpg`}
              alt=""
              width={18}
              height={18}
              className="size-4 rounded border border-line/70"
            />
            {classLabel(entry.name)}
            <span className="text-[10px] text-muted/70">{entry.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setActiveSpec("all")} className={chipClass(activeSpec === "all")}>
          All specs
        </button>
        {specs.map((spec) => (
          <button
            key={spec}
            type="button"
            onClick={() => {
              setActiveSpec(spec);
              setVisibleCount(PAGE_SIZE);
            }}
            className={chipClass(activeSpec === spec)}
          >
            {specLabel(spec)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted/70">Mode</span>
        <button type="button" onClick={() => setActiveMode("all")} className={chipClass(activeMode === "all")}>
          All
        </button>
        {MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setActiveMode(mode);
              setVisibleCount(PAGE_SIZE);
            }}
            className={chipClass(activeMode === mode)}
          >
            {modeLabel(mode)}
          </button>
        ))}
        <span className="ml-auto text-muted/70">Sort</span>
        <button
          type="button"
          onClick={() => setSort("likes")}
          className={chipClass(sort === "likes")}
        >
          Most liked
        </button>
        <button type="button" onClick={() => setSort("new")} className={chipClass(sort === "new")}>
          Newest
        </button>
      </div>

      <p className="mt-4 text-[11px] text-muted/60">
        {filtered.length.toLocaleString("en-US")} builds · Source: Sargerastech (collected 2026-10-28)
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((build) => {
          const accent = classAccent[build.classSlug] ?? "#e3bd78";
          return (
            <button
              key={build.id}
              type="button"
              onClick={() => setSelected(build)}
              className="panel panel-hover group relative flex flex-col overflow-hidden p-5 text-left"
              style={{ "--accent": accent } as React.CSSProperties}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`/talents/icons/${build.specIcon}.jpg`}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-lg border border-line/80"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                      {classLabel(build.className)} · {specLabel(build.specName)}
                      {build.mode ? ` · ${modeLabel(build.mode)}` : ""}
                    </p>
                    <h2 className="display mt-1 line-clamp-2 text-lg text-parchment">
                      {build.nameEn || build.name}
                    </h2>
                  </div>
                </div>
                <img
                  src={`/classes/icons/${build.classSlug}.jpg`}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 rounded border border-line/70 opacity-80"
                />
              </div>

              {build.descriptionEn || build.description ? (
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">
                  {build.descriptionEn || build.description}
                </p>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted/50">No description</p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[11px] text-muted/70">
                <span>
                  {build.owner || "Anonymous"} · {formatDate(build.updatedAt)}
                </span>
                <span className="flex items-center gap-2 text-gold/85">
                  {build.spentPoints} pts
                  <span className="text-muted/70">♥ {build.likes}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {visibleCount < filtered.length ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-lg border border-line px-5 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
          >
            Load more ({(filtered.length - visibleCount).toLocaleString("en-US")} remaining)
          </button>
        </div>
      ) : null}

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="display text-xl text-parchment">Top authors</h2>
            <span className="text-[11px] text-muted/60">Ranked by build index</span>
          </div>
          <ol className="mt-4 divide-y divide-line/60 text-sm">
            {ranking.slice(0, 10).map((row) => (
              <li key={`${row.rank}-${row.nickname}`} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-6 shrink-0 text-right text-xs text-muted/60">{row.rank}</span>
                  <span className="truncate text-parchment/90">{row.nickname}</span>
                  {row.realm ? <span className="shrink-0 text-[10px] text-muted/50">{row.realm}</span> : null}
                </span>
                <span className="shrink-0 text-[11px] text-muted/70">
                  {row.buildCount} builds · {row.talentIndex} index
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="display text-xl text-parchment">Spec popularity</h2>
            <span className="text-[11px] text-muted/60">3,556 builds site-wide</span>
          </div>
          <ol className="mt-4 divide-y divide-line/60 text-sm">
            {specRanking.slice(0, 10).map((row) => (
              <li key={`${row.classSlug}-${row.specName}`} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-6 shrink-0 text-right text-xs text-muted/60">{row.rank}</span>
                  <img
                    src={`/classes/icons/${row.classSlug}.jpg`}
                    alt=""
                    width={18}
                    height={18}
                    className="size-4 rounded border border-line/70"
                  />
                  <span className="truncate text-parchment/90">
                    {classLabel(row.className)} · {specLabel(row.specName)}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] text-muted/70">{row.count} builds</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="panel max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  {classLabel(selected.className)} · {specLabel(selected.specName)}
                  {selected.mode ? ` · ${modeLabel(selected.mode)}` : ""}
                </p>
                <h3 className="display mt-2 text-2xl text-parchment">
                  {selected.nameEn || selected.name}
                </h3>
                <p className="mt-1 text-xs text-muted/70">
                  {selected.owner || "Anonymous"} · updated {formatDate(selected.updatedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded border border-line px-2 py-1 text-xs text-muted hover:text-parchment"
              >
                Close
              </button>
            </div>

            {selected.descriptionEn || selected.description ? (
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {selected.descriptionEn || selected.description}
              </p>
            ) : null}

            <div className="mt-5 space-y-3">
              <p className="text-xs text-muted/70">
                Point spread · <span className="text-parchment/90">{selected.spentPoints}</span>
              </p>
              {(treeLabels.length > 0 ? treeLabels : ["First tree", "Second tree", "Third tree"]).map((label, index) => {
                const points = spent[index] ?? 0;
                const width = Math.min(100, Math.round((points / 51) * 100));
                return (
                  <div key={label} className="flex items-center gap-3 text-xs">
                    <span className="w-24 shrink-0 text-muted">{label}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/40">
                      <span
                        className="block h-full rounded-full bg-gold/70"
                        style={{ width: `${width}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right text-parchment/80">{points} pt</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-muted/70">
              <span className="rounded-full border border-line/70 px-3 py-1">♥ {selected.likes} likes</span>
              <span className="rounded-full border border-line/70 px-3 py-1">★ {selected.favorites} saves</span>
              <span className="rounded-full border border-line/70 px-3 py-1">💬 {selected.comments} comments</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-[11px] leading-relaxed text-muted/50">
                Point bars show the tree split. Open the planner to inspect every
                talent with the exact imported points.
              </p>
              <Link
                href={buildHref(selected)}
                className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-xs text-gold-soft transition-colors hover:border-gold/70"
              >
                Open in planner
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
