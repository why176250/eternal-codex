import type { Metadata } from "next";
import Link from "next/link";
import balance from "@/data/balance-latest.json";

export const metadata: Metadata = {
  title: "Latest balance changes — WoW Forever",
  description: "Latest WoW Forever balance update summary: buffs, nerfs, talent tree changes, and item changes.",
  alternates: { canonical: "/patch-notes/balance" },
};

export default function BalancePage() {
  const rows = [
    { label: "Buffs", value: balance.buffs, color: "#6fcf97", arrow: "↑" },
    { label: "Nerfs", value: balance.nerfs, color: "#ff6b6b", arrow: "↓" },
    { label: "Other changes", value: balance.otherChanges, color: "#e3bd78" },
    { label: "Talent tree changes", value: balance.talentTreeChanges, color: "#ede7d7" },
    { label: "New items", value: balance.newItems, color: "#ede7d7" },
    { label: "Changed items", value: balance.changedItems, color: "#ede7d7" },
  ];
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <p className="eyebrow">Patch notes · Balance</p>
          <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">Latest balance changes</h1>
          <p className="mt-3 text-sm text-muted">{balance.displayDate} · Build {balance.build}</p>
        </div>
      </section>
      <section className="container-x max-w-3xl py-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => <div key={row.label} className="panel p-4"><p className="text-[10px] uppercase tracking-wider text-muted">{row.label}</p><p className="mt-1 text-2xl" style={{ color: row.color }}>{row.arrow}{row.value}</p></div>)}
        </div>
        <div className="panel mt-4 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-parchment">What changed</p>
          <p className="mt-2">The October 28 build is mostly a mage talent pass: Arcane Focus leaves the Arcane tree, Elemental Precision becomes Precision with hit chance for all spells, Improved Fireball becomes Accelerant, Incineration and Critical Mass change ranks, and several talents move. The same build changes the Adventurer’s Tent and four items.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/patch-notes" className="rounded-lg border border-line px-4 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">← All patch notes</Link>
          <a href={balance.source} target="_blank" rel="noreferrer" className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-xs text-gold-soft">Full class-by-class source →</a>
        </div>
      </section>
    </main>
  );
}
