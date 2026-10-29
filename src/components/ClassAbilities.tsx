"use client";

import Link from "next/link";
import { useState } from "react";
import type { AbilityTab, ClassAbility } from "@/lib/class-abilities";

type Props = {
  tabs: AbilityTab[];
  accent: string;
};

export function ClassAbilities({ tabs, accent }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState<ClassAbility | null>(null);
  const active = tabs[activeTab] ?? tabs[0];

  if (!active) return null;

  return (
    <div className="panel overflow-hidden">
      <div className="flex overflow-x-auto border-b border-line/70 p-3">
        {tabs.map((tab, index) => (
          <button
            key={`${tab.nameEn}-${index}`}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`shrink-0 rounded-lg border px-4 py-2 text-xs transition-colors ${
              index === activeTab
                ? "border-gold/50 bg-gold/[0.08] text-gold-soft"
                : "border-transparent text-muted hover:bg-white/[0.03] hover:text-parchment"
            }`}
          >
            {tab.nameEn}
            <span className="ml-2 text-[10px] text-muted/60">{tab.skills.length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-5">
        {active.skills.map((skill) => (
          <div key={`${active.nameEn}-${skill.id}`} className="relative">
            <Link
              href={`/spells/${skill.id}`}
              className="flex items-start gap-3 rounded-lg border border-line/70 bg-deep/40 p-3 pr-9 text-left transition-colors hover:border-gold/35 hover:bg-white/[0.03]"
            >
              <img
                src={`/talents/icons/${skill.icon}.jpg`}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-md border border-line/80"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-parchment">
                  {skill.nameEn || skill.name}
                </span>
                <span className="mt-1 block text-[10px] text-muted">
                  {skill.rankLabel || (skill.rankNum ? `Rank ${skill.rankNum}` : "Ability")}
                  {skill.levelReq ? ` · Level ${skill.levelReq}` : ""}
                </span>
                {skill.desc ? (
                  <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-muted/80">
                    {skill.desc}
                  </span>
                ) : null}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSelected(skill)}
              aria-label={`Quick view ${skill.nameEn || skill.name}`}
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded border border-line/70 bg-abyss/80 text-[10px] text-muted hover:border-gold/40 hover:text-parchment"
            >
              i
            </button>
          </div>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.nameEn || selected.name}
            className="panel max-h-[85vh] w-full max-w-lg overflow-y-auto p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <img
                src={`/talents/icons/${selected.icon}.jpg`}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-lg border border-line/80"
              />
              <div className="min-w-0 flex-1">
                <p className="eyebrow">Class ability</p>
                <h2 className="display mt-1 text-xl text-parchment">
                  {selected.nameEn || selected.name}
                </h2>
                <p className="mt-1 text-[11px] text-muted">
                  {selected.rankLabel || "Ability"}
                  {selected.levelReq ? ` · Level ${selected.levelReq}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-muted transition-colors hover:text-parchment"
                aria-label="Close ability detail"
              >
                ✕
              </button>
            </div>

            {selected.desc ? (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                {selected.desc}
              </p>
            ) : null}
            {selected.cost ? (
              <p className="mt-3 text-xs text-gold/80">{selected.cost}</p>
            ) : null}
            <Link href={`/spells/${selected.id}`} className="mt-3 inline-block text-xs text-gold/85 hover:text-gold-soft">
              Open full spell page →
            </Link>

            {selected.ranks && selected.ranks.length > 0 ? (
              <div className="mt-4 space-y-2 border-t border-line/70 pt-3">
                <p className="eyebrow">Ranks</p>
                {selected.ranks.map((rank) => (
                  <div key={`${rank.lv}-${rank.spellId}`} className="text-xs leading-relaxed text-muted">
                    <span className="text-parchment/90">
                      {rank.lv ? `Level ${rank.lv}` : "Rank"}
                    </span>
                    {rank.desc ? ` — ${rank.desc}` : ""}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
