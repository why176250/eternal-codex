"use client";

import { useMemo, useState } from "react";
import {
  familyDietEn,
  familyNameEn,
  petBeasts,
  petFamilies,
  petIcon,
  petSkills,
} from "@/lib/hunter-pets";

type Tab = "families" | "beasts" | "skills";

export function HunterPetsBrowser() {
  const [tab, setTab] = useState<Tab>("families");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");

  const beastRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return petBeasts.filter((beast) => {
      if (family !== "all" && beast.familySlug !== family) return false;
      if (!q) return true;
      return `${beast.nameEn} ${beast.nameCn} ${beast.zonesCn} ${beast.familyNameCn}`
        .toLowerCase()
        .includes(q);
    });
  }, [family, query]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[
          ["families", "Families"],
          ["beasts", "Tameable beasts"],
          ["skills", "Pet skills"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as Tab)}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              tab === id
                ? "border-gold/60 bg-gold/[0.08] text-gold-soft"
                : "border-line/70 text-muted hover:border-line hover:text-parchment"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "families" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {petFamilies.map((entry) => (
            <article key={entry.slug} className="panel p-4">
              <div className="flex items-start gap-3">
                <img
                  src={petIcon(entry.icon)}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-lg border border-line/80"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm text-parchment">
                      {familyNameEn(entry.slug, entry.name)}
                    </h2>
                    {entry.isNew ? <span className="badge">New</span> : null}
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted">{entry.name}</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {entry.beastCount} beasts · Diet: {familyDietEn(entry.slug, entry.diet)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted">
                <span className="rounded border border-line/60 px-2 py-0.5">DMG {entry.dmgLabel}</span>
                <span className="rounded border border-line/60 px-2 py-0.5">HP {entry.hpLabel}</span>
                <span className="rounded border border-line/60 px-2 py-0.5">Armor {entry.armorLabel}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.skills?.map((skill) => (
                  <span
                    key={skill.nameCn}
                    className="flex items-center gap-1 rounded border border-line/60 bg-deep/40 px-1.5 py-1 text-[10px] text-muted"
                  >
                    <img src={petIcon(skill.icon)} alt="" width={16} height={16} className="size-4 rounded" />
                    {skill.nameCn}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "beasts" ? (
        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search beast, zone, family"
              className="w-64 rounded-lg border border-line bg-deep px-3 py-2 text-xs text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none"
            />
            <select
              value={family}
              onChange={(event) => setFamily(event.target.value)}
              className="rounded-lg border border-line bg-deep px-3 py-2 text-xs text-parchment focus:border-gold/50 focus:outline-none"
            >
              <option value="all">All families</option>
              {petFamilies.map((entry) => (
                <option key={entry.slug} value={entry.slug}>
                  {familyNameEn(entry.slug, entry.name)}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-muted">{beastRows.length} beasts</span>
          </div>

          <div className="panel mt-3 overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-normal">Beast</th>
                  <th className="px-3 py-2 text-left font-normal">Family</th>
                  <th className="px-3 py-2 text-left font-normal">Level</th>
                  <th className="px-3 py-2 text-left font-normal">Speed</th>
                  <th className="px-4 py-2 text-left font-normal">Zones</th>
                </tr>
              </thead>
              <tbody>
                {beastRows.map((beast) => (
                  <tr key={beast.entry} className="border-t border-line/40">
                    <td className="px-4 py-2">
                      <span className="block text-parchment">{beast.nameEn}</span>
                      <span className="block text-[10px] text-muted">{beast.nameCn}</span>
                    </td>
                    <td className="px-3 py-2 text-muted">{beast.familyNameCn}</td>
                    <td className="px-3 py-2 text-muted">
                      {beast.minLevel ?? "?"}{beast.maxLevel && beast.maxLevel !== beast.minLevel ? `–${beast.maxLevel}` : ""}
                    </td>
                    <td className="px-3 py-2 text-muted">{beast.speed ?? "—"}</td>
                    <td className="px-4 py-2 text-muted">{beast.zonesCn || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {tab === "skills" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {petSkills.map((skill) => (
            <details key={skill.nameCn} className="panel p-4">
              <summary className="flex cursor-pointer list-none items-center gap-3">
                <img
                  src={petIcon(skill.icon)}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded border border-line/70"
                />
                <span className="min-w-0">
                  <span className="block text-sm text-parchment">{skill.nameCn}</span>
                  <span className="block text-[10px] text-muted">
                    {skill.ranks.length} rank{skill.ranks.length === 1 ? "" : "s"}
                  </span>
                </span>
              </summary>
              <div className="mt-3 space-y-2 border-t border-line/60 pt-3">
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
      ) : null}
    </div>
  );
}
