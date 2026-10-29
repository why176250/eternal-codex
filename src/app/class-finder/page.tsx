import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClassFinder } from "@/components/ClassFinder";

export const metadata: Metadata = {
  title: "Class finder — class and race recommendation",
  description:
    "Five questions to narrow down your class and race for World of Warcraft: Forever. Get three class matches with roles, reasons, and recommended races.",
  alternates: { canonical: "/class-finder" },
};

export default function ClassFinderPage() {
  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/classes", label: "Classes" },
            { href: "/class-finder", label: "Class finder" },
          ]}
        />
      </div>

      <header className="container-x pb-8 pt-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <div>
            <p className="eyebrow">Classes / Class finder</p>
            <h1 className="display mt-3 max-w-3xl text-3xl text-parchment md:text-5xl">
              Find the class you will still enjoy at 60
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Five quick questions. The result gives you three classes, the roles
              they cover, why they fit, and which races to consider.
            </p>
          </div>
          <Link
            href="/tools/class-wheel"
            className="panel panel-hover group flex h-full flex-col justify-between p-4"
          >
            <div>
              <p className="eyebrow">Still undecided?</p>
              <p className="display mt-2 text-xl text-parchment">Spin the class wheel</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Skip the questions and let fate pick one of the nine classes.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-2 text-xs text-gold/85">
              Open the wheel
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </header>

      <section className="container-x max-w-4xl pb-20">
        <ClassFinder />
        <p className="mt-6 text-[11px] leading-relaxed text-muted/60">
          The finder is a starting point, not a tier list. Forever can change
          race combinations; confirm the final list at character creation.
        </p>
        <Link
          href="/classes"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/[0.06] px-5 py-3 text-sm text-gold-soft transition-colors hover:border-gold/70 hover:bg-gold/[0.1]"
        >
          Browse all class guides
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
