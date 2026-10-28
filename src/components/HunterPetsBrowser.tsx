"use client";

import { useMemo, useState } from "react";
import {
  familyDietEn,
  familyNameEn,
  petBeasts,
  petFamilies,
  petIcon,
} from "@/lib/hunter-pets";

type Tab = "info" | "beasts";

function numeric(label: string): number {
  const value = Number.parseFloat(label.replace("%", ""));
  return Number.isFinite(value) ? value : 0;
}

function statWidth(value: number): string {
  if (value === 0) return "2%";
  return `${Math.min(100, 20 + Math.abs(value) * 4)}%`;
}

export function HunterPetsBrowser() {
  const [selectedSlug, setSelectedSlug] = useState("wind-serpent");
  const [tab, setTab] = useState<Tab>("info");
  const [familyQuery, setFamilyQuery] = useState("");
  const [beastQuery, setBeastQuery] = useState("");

  const family =
    petFamilies.find((entry) => entry.slug === selectedSlug) ?? petFamilies[0];

  const visibleFamilies = useMemo(() => {
    const q = familyQuery.trim().toLowerCase();
    if (!q) return petFamilies;
    return petFamilies.filter((entry) =>
      `${entry.name} ${familyNameEn(entry.slug, "")}`.toLowerCase().includes(q),
    );
  }, [familyQuery]);

  const familyBeasts = useMemo(() => {
    const q = beastQuery.trim().toLowerCase();
    return petBeasts.filter((beast) => {
      if (beast.familySlug !== family.slug) return false;
      if (!q) return true;
      return `${beast.nameEn} ${beast.nameCn} ${beast.zonesCn}`
        .toLowerCase()
        .includes(q);
    });
  }, [beastQuery, family.slug]);

  const dmg = numeric(family.dmgLabel);
  const armor = numeric(family.armorLabel);
  const hp = numeric(family.hpLabel);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-start">
        <input
          value={familyQuery}
          onChange={(event) => setFamilyQuery(event.target.value)}
          placeholder="Search family"
          className="w-full rounded-full border border-line bg-deep px-4 py-2 text-xs text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {visibleFamilies.map((entry) => {
            const active = entry.slug === family.slug;
            return (
              <button
                key={entry.slug}
                type="button"
                title={familyNameEn(entry.slug, entry.name)}
                aria-label={familyNameEn(entry.slug, entry.name)}
                onClick={() => {
                  setSelectedSlug(entry.slug);
                  setTab("info");
                }}
                className={`relative size-12 overflow-hidden rounded-lg border transition-all ${
                  active
                    ? "border-gold/80 ring-2 ring-gold/30"
                    : "border-line/60 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={petIcon(entry.icon)}
                  alt=""
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
                {entry.isNew ? (
                  <span className="absolute right-0.5 top-0.5 rounded bg-gold px-1 text-[8px] text-abyss">
                    NEW
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex justify-center border-b border-line/60">
        {[
          ["info", "Basic info"],
          ["beasts", "Tameable beasts"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as Tab)}
            className={`-mb-px border-b-2 px-6 py-3 text-sm transition-colors ${
              tab === id
                ? "border-gold text-parchment"
                : "border-transparent text-muted hover:text-gold-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "info" ? (
        <div className="mt-5">
          <div className="flex items-start gap-4">
            <img
              src={petIcon(family.icon)}
              alt=""
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-xl border border-line/80"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="display text-2xl text-parchment">
                  {familyNameEn(family.slug, family.name)}
                </h2>
                {family.isNew ? <span className="badge">New</span> : null}
              </div>
              <p className="mt-1 text-xs text-muted">
                {family.name} · {family.beastCount} tameable beasts · Diet:{" "}
                {familyDietEn(family.slug, family.diet)}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Damage", family.dmgLabel, dmg],
              ["Armor", family.armorLabel, armor],
              ["Health", family.hpLabel, hp],
            ].map(([label, display, value]) => (
              <div key={label as string} className="flex items-center gap-3 text-xs">
                <span className="w-16 shrink-0 text-muted">{label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-deep">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: statWidth(value as number),
                      background:
                        (value as number) > 0
                          ? "#6fd5c5"
                          : (value as number) < 0
                            ? "#e08a8a"
                            : "#3a4a63",
                    }}
                  />
                </span>
                <span
                  className={`w-12 shrink-0 text-right ${
                    (value as number) > 0
                      ? "text-teal"
                      : (value as number) < 0
                        ? "text-red-300"
                        : "text-muted"
                  }`}
                >
                  {display}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="display text-lg text-parchment">Learnable skills</h3>
              <p className="text-[10px] text-muted">
                Tap a skill for ranks and pet levels
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {(family.skills ?? []).map((skill) => (
                <details key={skill.nameCn} className="rounded-lg border border-line/60 bg-deep/40">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-3 marker:hidden [&::-webkit-details-marker]:hidden">
                    <img
                      src={petIcon(skill.icon)}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 rounded border border-line/70"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-parchment">{skill.nameCn}</span>
                      <span className="block text-[10px] text-muted">
                        {skill.ranks.length} rank{skill.ranks.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="text-xs text-muted">⌄</span>
                  </summary>
                  <div className="space-y-2 border-t border-line/50 px-3 py-2">
                    {skill.ranks.map((rank) => (
                      <p key={`${rank.rank}-${rank.spellId}`} className="text-[11px] leading-relaxed text-muted">
                        <span className="text-parchment/90">Rank {rank.rank}</span>
                        {rank.petLevel ? ` · pet level ${rank.petLevel}` : ""}
                        {rank.descCn ? ` — ${rank.descCn}` : ""}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={beastQuery}
              onChange={(event) => setBeastQuery(event.target.value)}
              placeholder="Search beast or zone"
              className="w-56 rounded-lg border border-line bg-deep px-3 py-2 text-xs text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
            />
            <span className="text-[11px] text-muted">
              {familyBeasts.length} beasts in {familyNameEn(family.slug, family.name)}
            </span>
          </div>
          <div className="panel mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-normal">Beast</th>
                  <th className="px-3 py-2 text-left font-normal">Level</th>
                  <th className="px-3 py-2 text-left font-normal">Speed</th>
                  <th className="px-4 py-2 text-left font-normal">Zones</th>
                </tr>
              </thead>
              <tbody>
                {familyBeasts.map((beast) => (
                  <tr key={beast.entry} className="border-t border-line/40">
                    <td className="px-4 py-2">
                      <span className="block text-parchment">{beast.nameEn}</span>
                      <span className="block text-[10px] text-muted">{beast.nameCn}</span>
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {beast.minLevel ?? "?"}
                      {beast.maxLevel && beast.maxLevel !== beast.minLevel ? `–${beast.maxLevel}` : ""}
                    </td>
                    <td className="px-3 py-2 text-muted">{beast.speed ?? "—"}</td>
                    <td className="px-4 py-2 text-muted">{beast.zonesCn || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
