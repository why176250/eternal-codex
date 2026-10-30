import type { Metadata } from "next";
import Link from "next/link";
import { bisBuilds } from "@/lib/bis-db";

export const metadata: Metadata = {
  title: "Full BiS tables — Forever",
  description: "64 imported Forever BiS builds across classes, specs, phases, and PvE/PvP.",
  alternates: { canonical: "/bis/builds" },
};

export default function BisBuildsPage() {
  const byClass = new Map<string, typeof bisBuilds>();
  for (const build of bisBuilds) {
    if (!byClass.has(build.className)) byClass.set(build.className, []);
    byClass.get(build.className)!.push(build);
  }
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">BiS · Full tables</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Imported BiS builds</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {bisBuilds.length} imported builds across all classes, specs, phases,
            and PvE/PvP. Each build lists the best item per slot plus alternatives.
          </p>
        </div>
      </section>
      <section className="container-x py-10">
        {Array.from(byClass.entries()).map(([className, builds]) => (
          <div key={className} className="mb-8">
            <h2 className="display text-xl text-parchment">{className}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {builds.map((build) => (
                <Link key={build.key} href={`/bis/builds/${build.slug}`} className="panel panel-hover p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-parchment">{build.specName}</span>
                    <span className="badge">{build.mode}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted">Phase {build.stage} · {build.side === "1" ? "Alliance" : build.side === "2" ? "Horde" : "Both sides"}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
