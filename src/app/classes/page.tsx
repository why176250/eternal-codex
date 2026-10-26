import type { Metadata } from "next";
import { classes } from "@/lib/data";
import { ClassCard } from "@/components/ClassCard";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "All nine classes for World of Warcraft: Forever — roles, leveling reality checks, dual-spec plans, and the trade-offs that matter on launch week.",
  alternates: { canonical: "/classes" },
};

export default function ClassesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Classes</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Pick the class you will still enjoy at 60
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Nine class overviews built around the questions that actually matter
            on launch week: how bad is the leveling, what does the group need,
            and what does your second spec at 40 look like?
          </p>
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
            <p className="font-medium text-parchment">A note on class changes</p>
            <p className="mt-1">
              Forever ships class and race-combination changes on top of the
              Classic baseline. The overviews here describe the stable parts of
              each class — roles, leveling feel, group demand. New abilities,
              reworked talents, and race availability should be verified on the
              character-creation screen before you commit.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
