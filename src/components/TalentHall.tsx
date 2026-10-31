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

type Props = {
  builds: TalentHallBuild[];
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
  const params = new URLSearchParams({
    b: `${build.classId}:${pairs}`,
    lvl: "60",
    build: String(build.id),
    buildName: build.nameEn || build.name,
    buildDesc: build.descriptionEn || build.description || "",
    buildAuthor: build.owner || "",
  });
  return `/tools/build?${params.toString()}`;
}

function chipClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs transition-colors ${
    active
      ? "border-gold/60 bg-gold/[0.08] text-gold-soft"
      : "border-line/70 text-muted hover:border-line hover:text-parchment"
  }`;
}

export function TalentHall({ builds }: Props) {
  const [activeClass, setActiveClass] = useState("all");
  const [activeSpec, setActiveSpec] = useState("all");
  const [activeMode, setActiveMode] = useState("all");
  const [sort, setSort] = useState<"likes" | "new">("likes");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
        {filtered.length.toLocaleString("en-US")} builds · Source: Official data, Wowhead
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((build) => {
          const accent = classAccent[build.classSlug] ?? "#e3bd78";
          return (
            <Link
              key={build.id}
              href={buildHref(build)}
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
            </Link>
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






    </div>
  );
}
