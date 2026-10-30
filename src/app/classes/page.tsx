import type { Metadata } from "next";
import Link from "next/link";
import { classes } from "@/lib/data";
import { ClassCard } from "@/components/ClassCard";
import { allSpecGuides } from "@/lib/spec-guides";

export const metadata: Metadata = {
  title: "Class guides",
  description:
    "Nine classes and 28 spec guides for World of Warcraft: Forever — overview, changes, pros and cons, race recommendations, and professions.",
  alternates: { canonical: "/classes", languages: { en: "/classes", "zh-Hans": "/zh/classes", "x-default": "/classes" } },
};

export default function ClassesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Class guides</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Every spec, one page
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Nine classes, {allSpecGuides.length} specs. Pick a class, then a spec:
            overview, what changed, pros and cons, race recommendations, and
            professions.
          </p>
          <div className="mt-5">
            <Link
              href="/class-finder"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.05] px-3 py-1.5 text-xs text-gold-soft transition-colors hover:border-gold/55"
            >
              Not sure? Take the class finder
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">9 classes</span>
            <span className="rounded-full border border-line/80 px-3 py-1">{allSpecGuides.length} specs</span>
            <span className="rounded-full border border-line/80 px-3 py-1">5 core sections</span>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((wowClass) => (
              <ClassCard key={wowClass.id} wowClass={wowClass} />
            ))}
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">How these pages are built</p>
            <p className="mt-1">
              Spec guides use imported Forever data from the 蓝色隐士 community
              database. Each page credits its source and is marked for personal,
              non-commercial use. Beta values can change — verify the final
              tooltip in game.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
