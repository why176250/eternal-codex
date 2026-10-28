import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { classes, difficultyLabel, getClass } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClassPageTabs } from "@/components/ClassPageTabs";
import { getClassAbilities } from "@/lib/class-abilities";
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

  const abilities = getClassAbilities(wowClass.id);

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
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 rounded-full border border-line/80 px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/45 hover:text-gold-soft"
          >
            <span aria-hidden="true">←</span>
            All classes
          </Link>

          <div
            aria-label="Switch class"
            className="flex gap-1.5 overflow-x-auto pb-1 sm:gap-2"
          >
            {classes.map((entry) => {
              const active = entry.id === wowClass.id;
              return (
                <Link
                  key={entry.id}
                  href={`/classes/${entry.id}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={entry.name}
                  className={`group flex shrink-0 flex-col items-center gap-1 rounded-lg border p-1.5 transition-colors ${
                    active
                      ? "bg-white/[0.04]"
                      : "border-transparent hover:bg-white/[0.03]"
                  }`}
                  style={active ? { borderColor: `${entry.accent}99` } : undefined}
                >
                  <img
                    src={`/classes/icons/${entry.id}.jpg`}
                    alt=""
                    width={34}
                    height={34}
                    className={`size-8 rounded border border-line/70 transition-all sm:size-9 ${
                      active
                        ? "opacity-100"
                        : "opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                    }`}
                  />
                  <span
                    className={`text-[9px] leading-none ${
                      active ? "text-parchment" : "text-muted/70"
                    }`}
                  >
                    {entry.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {specs.length > 0 ? (
          <ClassPageTabs
            specs={specs}
            abilities={abilities}
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
