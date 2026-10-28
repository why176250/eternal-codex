"use client";

import { useEffect, useState } from "react";

/** 2026-11-04 15:00 PST = 23:00 UTC. */
const LAUNCH_AT = Date.UTC(2026, 10, 4, 23, 0, 0);

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function LaunchCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = now === null ? null : LAUNCH_AT - now;
  const live = diff !== null && diff <= 0;
  const values = diff === null ? null : split(Math.abs(diff));

  return (
    <section className="panel relative w-full overflow-hidden p-5 lg:max-w-[420px] 2xl:max-w-[460px] 2xl:p-6">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gold">
            <span className={`size-1.5 rounded-full ${live ? "bg-teal" : "bg-gold"}`} />
            {live ? "Servers live" : "Global launch"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {live
              ? "Forever is live — counting since launch"
              : "Nov 4 · 3 PM PT · Nov 5 · 07:00 CST"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          ["Days", values?.days],
          ["Hours", values?.hours],
          ["Minutes", values?.minutes],
          ["Seconds", values?.seconds],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-lg border border-line/70 bg-deep/60 py-2 text-center"
          >
            <p className="display text-2xl tabular-nums text-gold-soft md:text-[1.7rem] 2xl:text-3xl">
              {value === undefined ? "--" : pad(value as number)}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-muted">
              {label as string}
            </p>
          </div>
        ))}
      </div>

      {live ? (
        <p className="mt-3 text-[11px] text-teal/90">
          Counting up since launch. See the release hub for region times.
        </p>
      ) : null}
    </section>
  );
}
