import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { classes, difficultyLabel, getClass } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClassSpecGuide } from "@/components/ClassSpecGuide";
import { getSpecGuides } from "@/lib/spec-guides";
import { decorateSkillMarkers } from "@/lib/skill-tooltips";

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

  const classIndex = classes.findIndex((entry) => entry.id === wowClass.id);
  const prevClass = classes[(classIndex - 1 + classes.length) % classes.length];
  const nextClass = classes[(classIndex + 1) % classes.length];

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
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1
            className="display text-4xl md:text-6xl"
            style={{ color: wowClass.accent }}
          >
            {wowClass.name}
          </h1>
          <img
            src={`/classes/icons/${wowClass.id}.jpg`}
            alt=""
            width={64}
            height={64}
            className="size-14 shrink-0 rounded-xl border object-cover md:size-16"
            style={{
              borderColor: `${wowClass.accent}66`,
              boxShadow: `0 0 32px -18px ${wowClass.accent}`,
            }}
          />
        </div>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {wowClass.tagline}
        </p>
      </header>

      <section className="container-x pb-20">
        <div className="mb-4">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 rounded-full border border-line/80 px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/45 hover:text-gold-soft"
          >
            <span aria-hidden="true">←</span>
            All classes
          </Link>
        </div>

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

        <nav
          aria-label="Class navigation"
          className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr]"
        >
          <Link
            href={`/classes/${prevClass.id}`}
            className="panel panel-hover group flex items-center gap-3 p-4"
          >
            <span className="text-lg text-gold/60 transition-transform group-hover:-translate-x-1">←</span>
            <img
              src={`/classes/icons/${prevClass.id}.jpg`}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-md border border-line/80"
            />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-muted">Previous class</span>
              <span className="block truncate text-sm text-parchment">{prevClass.name}</span>
            </span>
          </Link>

          <Link
            href="/classes"
            className="flex items-center justify-center rounded-lg px-4 py-2 text-xs text-muted transition-colors hover:text-gold-soft"
          >
            All classes
          </Link>

          <Link
            href={`/classes/${nextClass.id}`}
            className="panel panel-hover group flex items-center justify-end gap-3 p-4 text-right"
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-muted">Next class</span>
              <span className="block truncate text-sm text-parchment">{nextClass.name}</span>
            </span>
            <img
              src={`/classes/icons/${nextClass.id}.jpg`}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-md border border-line/80"
            />
            <span className="text-lg text-gold/60 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </nav>
      </section>
    </main>
  );
}
