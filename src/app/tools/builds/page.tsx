import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BuildHall } from "@/components/BuildHall";
import buildsJson from "@/data/builds.json";

export const metadata: Metadata = {
  title: "Talent Hall — starter builds",
  description:
    "Starter talent builds for World of Warcraft: Forever. Open a build in the planner, adjust it, and make it your own.",
  alternates: { canonical: "/tools/builds" },
};

export default function BuildsPage() {
  const builds = buildsJson as React.ComponentProps<typeof BuildHall>["builds"];

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
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
          Start from a build, then make it yours
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Starter talent shells for every class we have builds for. Open one in
          the planner, move points around, and save your own version.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-muted">
          <span className="rounded-full border border-line/80 px-3 py-1">
            {builds.length} starter builds
          </span>
          <span className="rounded-full border border-line/80 px-3 py-1">
            Curated by Eversixty
          </span>
          <Link
            href="mailto:corrections@eversixty.com?subject=Talent%20Hall%20build%20submission"
            className="text-gold/80 underline-offset-4 hover:text-gold-soft hover:underline"
          >
            Submit a build →
          </Link>
        </div>
      </header>

      <section className="container-x pb-20">
        <BuildHall builds={builds} />
        <p className="mt-6 text-[11px] leading-relaxed text-muted/60">
          Starter shells are generated from the imported Forever talent trees
          and are meant as a starting point, not a claim about the strongest
          build. Community submissions will be added as they are reviewed.
        </p>
      </section>
    </main>
  );
}
