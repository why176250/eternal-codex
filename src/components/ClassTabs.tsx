"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClassChange } from "@/lib/class-changes";
import type { ClassGuide } from "@/data/class-guides";
import type { WoWClass } from "@/lib/data";
import { difficultyLabel } from "@/lib/data";

type Props = {
  wowClass: WoWClass;
  guide: ClassGuide;
  changes: ClassChange[];
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "changes", label: "What changed" },
  { id: "proscons", label: "Pros & cons" },
  { id: "races", label: "Races" },
  { id: "professions", label: "Professions" },
] as const;

export function ClassTabs({ wowClass, guide, changes }: Props) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview");

  return (
    <div className="panel overflow-hidden">
      <div
        role="tablist"
        aria-label={`${wowClass.name} guide sections`}
        className="flex overflow-x-auto border-b border-line/70"
      >
        {tabs.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-xs transition-colors md:px-5 ${
                selected
                  ? "border-gold text-parchment"
                  : "border-transparent text-muted hover:text-gold-soft"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 md:p-6">
        <section
          id="panel-overview"
          role="tabpanel"
          hidden={active !== "overview"}
          className="space-y-8"
        >
          <div>
            <h2 className="display text-xl text-parchment">Why play it</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {wowClass.summary}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line/70 bg-deep/40 p-4">
              <h3 className="display text-lg text-parchment">Leveling reality check</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{wowClass.leveling}</p>
            </div>
            <div className="rounded-xl border border-line/70 bg-deep/40 p-4">
              <h3 className="display text-lg text-parchment">Dual spec at 40</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{wowClass.dualSpec}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted/70">
                Community-tracked from the beta. Confirm costs and switching rules at the trainer.
              </p>
            </div>
          </div>

          <div>
            <h2 className="display text-xl text-parchment">Group value</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {wowClass.roles.includes("Tank")
                ? "Tank classes set the pace of every dungeon. You will never wait for a group, but you are also the first person blamed when a pull goes wrong."
                : wowClass.roles.includes("Healer")
                  ? "Healer classes are always in demand. Groups form around you, and the skill floor is higher than it looks — mana management wins fights."
                  : "Pure damage classes trade group flexibility for raw output. Your value shows up in cleave, control, or utility rather than in the group finder."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">
              {difficultyLabel(wowClass.difficulty)} leveling
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              {wowClass.roles.join(" / ")}
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              Level 60 cap
            </span>
          </div>
        </section>

        <section
          id="panel-changes"
          role="tabpanel"
          hidden={active !== "changes"}
          className="space-y-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="display text-xl text-parchment">What changed in Forever</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                New and reworked talents imported from the community tree. Open the
                planner for the full build.
              </p>
            </div>
            <Link
              href="/tools/build"
              className="text-xs text-gold/85 underline-offset-4 hover:text-gold-soft hover:underline"
            >
              Open talent tree →
            </Link>
          </div>

          {changes.length === 0 ? (
            <p className="text-sm text-muted">No imported changes for this class yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {changes.map((change) => (
                <article
                  key={`${change.tree}-${change.name}`}
                  className="rounded-xl border border-line/70 bg-deep/40 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                        change.status === "new"
                          ? "border-teal/40 bg-teal/10 text-teal"
                          : "border-gold/30 bg-gold/[0.07] text-gold-soft"
                      }`}
                    >
                      {change.status === "new" ? "New" : "Changed"}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted/70">
                      {change.tree}
                    </span>
                  </div>
                  <h3 className="display mt-2 text-base text-parchment">{change.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {change.description}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-muted/60">
                    {change.maxRanks} rank{change.maxRanks === 1 ? "" : "s"}
                  </p>
                </article>
              ))}
            </div>
          )}
          <p className="text-[11px] leading-relaxed text-muted/60">
            Beta data can change before launch. Verify the final tooltip on the
            character-creation screen.
          </p>
        </section>

        <section
          id="panel-proscons"
          role="tabpanel"
          hidden={active !== "proscons"}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-teal/25 bg-teal/[0.03] p-4">
              <h2 className="display text-lg text-teal">Strengths</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                {guide.pros.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-teal/80" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gold/[0.03] p-4">
              <h2 className="display text-lg text-gold-soft">Weaknesses</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                {guide.cons.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="panel-races"
          role="tabpanel"
          hidden={active !== "races"}
          className="space-y-4"
        >
          <div>
            <h2 className="display text-xl text-parchment">Race recommendations</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Classic-era priorities. Forever can open extra combinations — confirm
              the final list on the character-creation screen.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {guide.races.map((race) => (
              <div key={race.name} className="rounded-xl border border-line/70 bg-deep/40 p-4">
                <h3 className="display text-base text-parchment">{race.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{race.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="panel-professions"
          role="tabpanel"
          hidden={active !== "professions"}
          className="space-y-4"
        >
          <div>
            <h2 className="display text-xl text-parchment">Profession recommendations</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pick one gathering profession and one crafting profession unless you
              have a dedicated gold plan.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {guide.professions.map((profession) => (
              <div key={profession.name} className="rounded-xl border border-line/70 bg-deep/40 p-4">
                <h3 className="display text-base text-parchment">{profession.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{profession.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
