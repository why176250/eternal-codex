import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { classes, difficultyLabel, getBisClass, getClass } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
    title: `${wowClass.name} class overview`,
    description: `${wowClass.tagline} Roles, leveling, and dual-spec plans for ${wowClass.name} in World of Warcraft: Forever.`,
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
          {wowClass.roles.join(" · ")} · {difficultyLabel(wowClass.difficulty)} to level
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

      <section className="container-x grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-10">
          <div>
            <h2 className="display text-xl text-parchment">Why play it</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {wowClass.summary}
            </p>
          </div>

          <div className="panel p-6">
            <h2 className="display text-lg text-parchment">Leveling reality check</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {wowClass.leveling}
            </p>
          </div>

          <div className="panel p-6">
            <h2 className="display text-lg text-parchment">
              Dual spec at 40
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {wowClass.dualSpec}
            </p>
            <p className="mt-3 text-xs text-muted/80">
              Dual-spec rules are community-tracked from the beta. Confirm costs
              and switching rules with the trainer at 40.
            </p>
          </div>

          <div>
            <h2 className="display text-xl text-parchment">Group value</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {wowClass.roles.includes("Tank")
                ? "Tank classes set the pace of every dungeon. You will never wait for a group, but you are also the first person blamed when a pull goes wrong."
                : wowClass.roles.includes("Healer")
                  ? "Healer classes are always in demand. Groups form around you, and the skill floor is higher than it looks — mana management wins fights."
                  : "Pure damage classes trade group flexibility for raw output. Your value shows up in cleave, control, or utility rather than in the group finder."}
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel p-5">
            <p className="eyebrow">At a glance</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Roles</dt>
                <dd className="text-parchment">{wowClass.roles.join(", ")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Leveling</dt>
                <dd className="text-parchment">
                  {difficultyLabel(wowClass.difficulty)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Second spec</dt>
                <dd className="text-parchment">Level 40</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Level cap</dt>
                <dd className="text-parchment">60</dd>
              </div>
            </dl>
          </div>

          <div className="panel p-5">
            <p className="eyebrow">Tips</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              {wowClass.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {getBisClass(wowClass.id) && (
            <Link
              href={`/bis/${wowClass.id}`}
              className="panel panel-hover block p-5 text-sm"
            >
              <p className="eyebrow">BiS checklist</p>
              <p className="mt-2 text-muted">
                The upgrades worth farming first for {wowClass.name} →
              </p>
            </Link>
          )}

          <div className="panel p-5 text-sm">
            <p className="eyebrow">Related</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/guides/dual-spec-at-40"
                  className="text-muted transition-colors hover:text-gold-soft"
                >
                  Dual spec at 40: what changes →
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/leveling-1-20-launch-route"
                  className="text-muted transition-colors hover:text-gold-soft"
                >
                  1–20 launch route →
                </Link>
              </li>
              <li>
                <Link
                  href="/database"
                  className="text-muted transition-colors hover:text-gold-soft"
                >
                  Pre-raid item database →
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
