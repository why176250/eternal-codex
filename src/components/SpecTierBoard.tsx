"use client";

import Link from "next/link";
import { useState } from "react";
import {
  specTierData,
  specTierLevelCap,
  specTierOrder,
  specTierRoleLabels,
  specTierUpdatedAt,
  type SpecTierRole,
} from "@/lib/spec-tier";

const tierColors: Record<string, string> = {
  S: "#ff6b5e", A: "#ff9f43", B: "#f6d365", C: "#6fcf97",
};

export function SpecTierBoard({ compact = false }: { compact?: boolean }) {
  const [role, setRole] = useState<SpecTierRole>("dps");
  const items = specTierData[role];

  return (
    <div className={compact ? "panel mt-3 p-3 md:p-4" : "panel p-4 md:p-5"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Spec rankings</p>
          <h2 className={`display mt-0.5 text-parchment ${compact ? "text-lg" : "text-2xl"}`}>Tier List · spec strength</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(specTierRoleLabels) as SpecTierRole[]).map((key) => (
            <button key={key} type="button" onClick={() => setRole(key)} className={`rounded-full border px-2.5 py-1 text-[10px] ${role === key ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:border-gold/40 hover:text-parchment"}`}>
              {specTierRoleLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div className={compact ? "mt-3 space-y-1" : "mt-4 space-y-2"}>
        {specTierOrder.map((tier) => {
          const tierItems = items.filter((item) => item.tier === tier);
          if (tierItems.length === 0) return null;
          return (
            <div key={tier} className="flex items-stretch overflow-hidden rounded-md border border-line/60">
              <div className="flex w-9 shrink-0 items-center justify-center text-base font-bold" style={{ color: tierColors[tier], background: `${tierColors[tier]}18` }}>{tier}</div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 bg-deep/30 px-1.5 py-1">
                {tierItems.map((item) => (
                  <Link key={`${tier}-${item.specId}-${item.name}`} href={`/classes/${item.classSlug}`} title={item.nameEn} className={`flex items-center gap-1 rounded border border-line/50 bg-abyss/40 px-1 py-0.5 transition-colors hover:border-gold/40 ${compact ? "max-w-[9rem]" : ""}`}>
                    <img src={item.icon} alt="" width={compact ? 20 : 24} height={compact ? 20 : 24} className={`shrink-0 rounded object-cover ${compact ? "size-5" : "size-6"}`} />
                    <span className={`truncate ${compact ? "text-[10px]" : "text-xs"} text-parchment`}>{item.nameEn}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className={`mt-2 text-[10px] text-muted/60 ${compact ? "" : "mt-3"}`}>Lv{specTierLevelCap} cap · Updated {specTierUpdatedAt} · {items.length} specs</p>
    </div>
  );
}
