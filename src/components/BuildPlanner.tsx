"use client";

import { useEffect, useState } from "react";
import { TalentPlanner } from "@/components/TalentPlanner";
import { LegacyPlanner } from "@/components/LegacyPlanner";
import type { ForeverLegacy, ForeverTalentClass } from "@/lib/forever";

type Tab = "talent" | "legacy";

export function BuildPlanner({
  classes,
  legacy,
}: {
  classes: ForeverTalentClass[];
  legacy: ForeverLegacy;
}) {
  const [tab, setTab] = useState<Tab>("talent");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (requested === "legacy" || requested === "talent") setTab(requested);
  }, []);

  function select(next: Tab) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url.toString());
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "talent", label: "Talent build", zh: "天赋模拟" },
            { id: "legacy", label: "Legacy path", zh: "传承模拟" },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => select(option.id)}
            className={
              "rounded-lg border px-4 py-2 text-sm transition-colors " +
              (tab === option.id
                ? "border-gold/50 bg-gold/10 text-gold-soft"
                : "border-line text-muted hover:border-gold/40 hover:text-parchment")
            }
          >
            {option.label}
            <span className="ml-2 text-[11px] text-muted/70">{option.zh}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "talent" ? (
          <TalentPlanner classes={classes} />
        ) : (
          <LegacyPlanner data={legacy} />
        )}
      </div>
    </div>
  );
}
