import type { Metadata } from "next";
import Link from "next/link";
import { foreverBisClasses, foreverBisLevels, foreverBisLists, foreverBisModes } from "@/lib/bis-forever";

export const metadata: Metadata = {
  title: "Forever BIS lists — level 20 and 30",
  description: "65 imported Forever BIS lists covering level 20 and level 30 PvE, PvP, and tank sets.",
  alternates: { canonical: "/bis/forever" },
};

type SearchParams = Promise<{ level?: string; mode?: string; class?: string }>;

export default async function ForeverBisPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const level = params.level ?? "all";
  const mode = params.mode ?? "all";
  const className = params.class ?? "all";
  const lists = foreverBisLists.filter((list) =>
    (level === "all" || String(list.level) === level) &&
    (mode === "all" || list.mode === mode) &&
    (className === "all" || list.class === className),
  );
  function href(next: { level?: string; mode?: string; class?: string }) {
    const p = new URLSearchParams();
    const values = { level: next.level ?? level, mode: next.mode ?? mode, class: next.class ?? className };
    for (const [key, value] of Object.entries(values)) if (value !== "all") p.set(key, value);
    return p.toString() ? `/bis/forever?${p.toString()}` : "/bis/forever";
  }
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <p className="eyebrow">BiS · ForeverChanges import</p>
          <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">Forever BIS lists</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            65 lists with level 20 and level 30 versions. Filter by level, mode, and class.
          </p>
        </div>
      </section>
      <section className="container-x py-8">
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/bis/forever" className={`rounded-full border px-3 py-1.5 ${level === "all" && mode === "all" && className === "all" ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:text-parchment"}`}>All</Link>
          {foreverBisLevels.map((value) => <Link key={value} href={href({ level: String(value) })} className={`rounded-full border px-3 py-1.5 ${level === String(value) ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:text-parchment"}`}>Level {value}</Link>)}
          {foreverBisModes.map((value) => <Link key={value} href={href({ mode: value })} className={`rounded-full border px-3 py-1.5 ${mode === value ? "border-gold/55 bg-gold/10 text-gold-soft" : "border-line/70 text-muted hover:text-parchment"}`}>{value}</Link>)}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {foreverBisClasses.map((value) => <Link key={value} href={href({ class: value })} className={`rounded border px-2 py-1 ${className === value ? "border-gold/55 text-gold-soft" : "border-line/60 text-muted hover:text-parchment"}`}>{value}</Link>)}
        </div>
        <p className="mt-4 text-xs text-muted">{lists.length} lists</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Link key={list.slug} href={`/bis/forever/${list.slug}`} className="panel panel-hover p-4">
              <div className="flex items-center justify-between gap-2"><span className="text-sm text-parchment">{list.spec || list.class}</span><span className="badge">{list.level}</span></div>
              <p className="mt-1 text-[11px] text-muted">{list.class} · {list.mode} · {list.slots.length} slots</p>
              <span className="mt-3 inline-block text-[11px] text-gold/80">Open list →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
