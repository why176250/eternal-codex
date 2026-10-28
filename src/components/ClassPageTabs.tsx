"use client";

import Link from "next/link";
import { useState } from "react";
import { ClassAbilities } from "@/components/ClassAbilities";
import { ClassSpecGuide, type SpecView } from "@/components/ClassSpecGuide";
import type { AbilityTab } from "@/lib/class-abilities";

type Props = {
  specs: SpecView[];
  abilities: AbilityTab[];
  accent: string;
  className: string;
  hunterPetsHref?: string;
};

export function ClassPageTabs({ specs, abilities, accent, className, hunterPetsHref }: Props) {
  const [tab, setTab] = useState<"specs" | "abilities">("specs");

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("specs")}
          className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
            tab === "specs"
              ? "border-gold/50 bg-gold/[0.08] text-gold-soft"
              : "border-line/70 text-muted hover:border-line hover:text-parchment"
          }`}
        >
          Spec guides
        </button>
        <button
          type="button"
          onClick={() => setTab("abilities")}
          className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
            tab === "abilities"
              ? "border-gold/50 bg-gold/[0.08] text-gold-soft"
              : "border-line/70 text-muted hover:border-line hover:text-parchment"
          }`}
        >
          Class abilities
        </button>
        {hunterPetsHref ? (
          <Link
            href={hunterPetsHref}
            className="rounded-lg border border-line/70 px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
          >
            Hunter pets →
          </Link>
        ) : null}
      </div>

      {tab === "specs" ? (
        <ClassSpecGuide specs={specs} accent={accent} className={className} />
      ) : (
        <ClassAbilities tabs={abilities} accent={accent} />
      )}
    </div>
  );
}
