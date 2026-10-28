import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { classes, difficultyLabel, getClass } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClassSpecGuide } from "@/components/ClassSpecGuide";
import { getSpecGuides } from "@/lib/spec-guides";
import { decorateSkillMarkers } from "@/lib/skill-icons";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return classes.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wowClass = getClass(slug);
  if (!wowClass) return { title: "Class not found" };
  return {
    title: `${wowClass.name} class guides`,
    description: `${wowClass.tagline} Spec-by-spec Forever guides for ${wowClass.name}: overview, changes, pros and cons, races, and professions.`,
    alternates: { canonical: `/classes/${wowClass.id}` },
  };
}

export default async function ClassPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const wowClass = getClass(slug);
  if (!wowClass) notFound();

  const specs = getSpecGuides(wowClass.id).map((spec) => ({
    ...spec,
    sections: spec.sections.map((section) => ({
      ...section,
      html: decorateSkillMarkers(marked.parse(section.markdown, { async: false }) as string),
    })),
  }));

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/classes", label: "Classes" },
            { href: `/classes/${wowClass.id}`, label: wowClass.name },
          ]}
        />
      </div>

      <header className="container-x pb-10 pt-8">
        <div
          className="h-1 w-24 rounded-full"
          style={{ background: wowClass.accent }}
          aria-hidden="true"
        />
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted">
          {specs.length} spec guides · {wowClass.roles.join(" · ")} ·{" "}
          {difficultyLabel(wowClass.difficulty)} to level
        </p>
        <h1
          className="display mt-2 text-4xl md:text-6xl"
          style={{ color: wowClass.accent }}
        >
          {wowClass.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {wowClass.tagline}
        </p>
      </header>

      <section className="container-x pb-20">
        {specs.length > 0 ? (
          <ClassSpecGuide
            specs={specs}
            accent={wowClass.accent}
            className={wowClass.name}
          />
        ) : (
          <p className="panel p-6 text-sm text-muted">
            No spec guides imported for this class yet.
          </p>
        )}
      </section>
    </main>
  );
}
