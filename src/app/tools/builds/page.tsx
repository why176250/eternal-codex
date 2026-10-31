import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TalentHall, type TalentHallBuild } from "@/components/TalentHall";
import buildsJson from "@/data/talent-hall/builds.json";
import { isPlannerValid } from "@/lib/talent-build-valid";

export const metadata: Metadata = {
  title: "Talent Hall — community builds",
  description:
    "1,100+ community talent builds for World of Warcraft: Forever, with point distribution, author ranking, and spec popularity. Collected from official game data and Wowhead.",
  alternates: { canonical: "/tools/builds" },
};

export default function BuildsPage() {
  const allBuilds = buildsJson.builds as TalentHallBuild[];
  const builds = allBuilds.filter(
    (build) =>
      build.talentSelections &&
      Object.keys(build.talentSelections).length > 0 &&
      isPlannerValid(build.classId, build.talentSelections),
  );

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/tools", label: "Tools" },
            { href: "/tools/builds", label: "Talent Hall" },
          ]}
        />
      </div>

      <header className="container-x pb-10 pt-8">
        <p className="eyebrow">Tools / Talent Hall</p>
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Talent Hall</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Community builds for World of Warcraft: Forever — filter by class, spec, and mode.
          Each build lists its point spread across talent trees, alongside top authors and spec popularity.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-muted">
          <span className="rounded-full border border-line/80 px-3 py-1">
            {builds.length.toLocaleString("en-US")} builds
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            Source: Official data, Wowhead
          </span>
        </div>
      </header>

      <section className="container-x pb-20">
        <TalentHall
          builds={builds}
        />
      </section>
    </main>
  );
}
