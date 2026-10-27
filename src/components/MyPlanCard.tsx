"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearPlan, loadPlans, type PlanKind, type PlanState } from "@/lib/plan";

export function MyPlanCard() {
  const [plans, setPlans] = useState<PlanState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlans(loadPlans());
    setReady(true);
  }, []);

  function remove(kind: PlanKind) {
    clearPlan(kind);
    setPlans(loadPlans());
  }

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">My plan</p>
          <p className="mt-1 text-xs text-muted">
            Saved in this browser only. No account, no sync.
          </p>
        </div>
        <p className="text-[11px] text-muted/70">Talent build + legacy path</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {/* Talent slot */}
        <div className="rounded-lg border border-line/70 bg-deep/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-gold/80">Talent build</p>
            {plans.talent ? (
              <span className="text-[10px] text-muted">saved</span>
            ) : null}
          </div>
          {!ready ? (
            <p className="mt-2 text-sm text-muted">Checking…</p>
          ) : plans.talent ? (
            <>
              <p className="mt-2 text-sm text-parchment">
                {plans.talent.className} · level {plans.talent.level} ·{" "}
                {plans.talent.points} point{plans.talent.points === 1 ? "" : "s"}
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={plans.talent.url}
                  className="rounded-md border border-gold/40 bg-gold/5 px-3 py-1.5 text-xs text-gold-soft transition-colors hover:bg-gold/10"
                >
                  Open build
                </a>
                <button
                  type="button"
                  onClick={() => remove("talent")}
                  className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-parchment">No talent build saved</p>
              <Link
                href="/tools/talents"
                className="mt-3 inline-block rounded-md border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
              >
                Build a talent plan →
              </Link>
            </>
          )}
        </div>

        {/* Legacy slot */}
        <div className="rounded-lg border border-line/70 bg-deep/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-teal">Legacy path</p>
            {plans.legacy ? (
              <span className="text-[10px] text-muted">saved</span>
            ) : null}
          </div>
          {!ready ? (
            <p className="mt-2 text-sm text-muted">Checking…</p>
          ) : plans.legacy ? (
            <>
              <p className="mt-2 text-sm text-parchment">
                {plans.legacy.points} / {plans.legacy.budget ?? 65} points spent
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={plans.legacy.url}
                  className="rounded-md border border-gold/40 bg-gold/5 px-3 py-1.5 text-xs text-gold-soft transition-colors hover:bg-gold/10"
                >
                  Open path
                </a>
                <button
                  type="button"
                  onClick={() => remove("legacy")}
                  className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-parchment">No legacy path saved</p>
              <Link
                href="/tools/legacy"
                className="mt-3 inline-block rounded-md border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
              >
                Plan a legacy path →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
