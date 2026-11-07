import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClassPopulationTabs } from "@/components/ClassPopulationTabs";
import data from "@/data/class-population.json";

export const metadata: Metadata = {
  title: "Class population",
  description: "Characters by class from the latest World of Warcraft: Forever community census. Counts are characters, not unique players.",
  alternates: { canonical: "/tools/class-population" },
};

export default function ClassPopulationPage() {
  return (
    <main>
      <div className="container-x pt-8"><Breadcrumbs items={[{ href: "/tools", label: "Tools" }, { href: "/tools/class-population", label: "Class population" }]} /></div>
      <header className="container-x pb-10 pt-8">
        <p className="eyebrow">Tools / Class population</p>
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Class population</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Characters by class, from the latest Forever census. Counts are characters, not unique players.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
          <span className="rounded-full border border-line/80 px-3 py-1">Updated {data.updatedAt}</span>
          <span className="rounded-full border border-line/80 px-3 py-1">Source: Community census · ClassicPlus.io</span>
          <span className="rounded-full border border-line/80 px-3 py-1">Characters, all levels</span>
        </div>
        <p className="mt-3 max-w-2xl text-[11px] leading-relaxed text-muted/60">Community census sampled since the beta opened; it includes beta-era characters and is not a unique-player count. Percentages come from the census source and are not re-rounded here.</p>
      </header>
      <section className="container-x pb-20">
        <ClassPopulationTabs factions={data.factions} totalCharacters={data.totalCharacters} />
        <p className="mt-5 text-xs text-muted/70">Historical launch poll: <Link href="/tools/class-popularity" className="text-gold/80 hover:text-gold-soft">41,270-vote final snapshot →</Link></p>
      </section>
    </main>
  );
}
