"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearPlan, loadPlan, type SavedPlan } from "@/lib/plan";

export function MyPlanCard() {
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlan(loadPlan());
    setReady(true);
  }, []);

  return (
    <div className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="eyebrow">My plan</p>
        {!ready ? (
          <p className="mt-2 text-sm text-muted">Checking this browser…</p>
        ) : plan ? (
          <>
            <p className="mt-2 text-sm text-parchment">
              {plan.className} · level {plan.level} · {plan.points} point{plan.points === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Saved in this browser. No account, no sync.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-parchment">No build saved yet</p>
            <p className="mt-1 text-xs text-muted">
              Plan a talent build, then save it here to pick up where you left
              off.
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        {plan ? (
          <>
            <a
              href={plan.url}
              className="rounded-md border border-gold/40 bg-gold/5 px-3 py-1.5 text-xs text-gold-soft transition-colors hover:bg-gold/10"
            >
              Open build
            </a>
            <button
              type="button"
              onClick={() => {
                clearPlan();
                setPlan(null);
              }}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Clear
            </button>
          </>
        ) : (
          <Link
            href="/tools/talents"
            className="rounded-md border border-gold/40 bg-gold/5 px-3 py-1.5 text-xs text-gold-soft transition-colors hover:bg-gold/10"
          >
            Build a plan →
          </Link>
        )}
      </div>
    </div>
  );
}
