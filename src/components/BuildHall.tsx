"use client";

import Link from "next/link";
import { useState } from "react";

type Build = {
  id: string;
  classSlug: string;
  className: string;
  specName: string;
  role: string;
  title: string;
  icon: string;
  points: number;
  author: string;
  updatedAt: string;
  description: string;
  href: string;
};

type Props = { builds: Build[] };

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

export function BuildHall({ builds }: Props) {
  const [active, setActive] = useState("all");
  const classNames = Array.from(new Set(builds.map((build) => build.className)));
  const visible = active === "all" ? builds : builds.filter((build) => build.classSlug === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            active === "all"
              ? "border-gold/60 bg-gold/[0.08] text-gold-soft"
              : "border-line/70 text-muted hover:border-line hover:text-parchment"
          }`}
        >
          All classes
        </button>
        {classNames.map((name) => {
          const build = builds.find((entry) => entry.className === name);
          if (!build) return null;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setActive(build.classSlug)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                active === build.classSlug
                  ? "border-gold/60 bg-gold/[0.08] text-gold-soft"
                  : "border-line/70 text-muted hover:border-line hover:text-parchment"
              }`}
            >
              <img
                src={`/classes/icons/${build.classSlug}.jpg`}
                alt=""
                width={18}
                height={18}
                className="size-4 rounded border border-line/70"
              />
              {name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((build) => {
          const accent = classAccent[build.classSlug] ?? "#e3bd78";
          return (
            <Link
              key={build.id}
              href={build.href}
              className="panel panel-hover group relative flex flex-col overflow-hidden p-5"
              style={{ "--accent": accent } as React.CSSProperties}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`/talents/icons/${build.icon}.jpg`}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-lg border border-line/80"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                      {build.specName} · {build.role}
                    </p>
                    <h2 className="display mt-1 text-lg text-parchment">{build.title}</h2>
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

              <p className="mt-4 text-sm leading-relaxed text-muted">{build.description}</p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[11px] text-muted/70">
                <span>
                  {build.author} · {build.updatedAt}
                </span>
                <span className="flex items-center gap-2 text-gold/85">
                  {build.points} points
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
