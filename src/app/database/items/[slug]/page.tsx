import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dungeons, getBisRefsForItem, getClass, getItem, items, qualityColors } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return items.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return { title: "Item not found" };
  return {
    title: `${item.name} — ${item.quality} ${item.slot}`,
    description: `${item.name}: level ${item.level} ${item.quality.toLowerCase()} ${item.slot.toLowerCase()} from ${item.source}. ${item.note}`,
    alternates: { canonical: `/database/items/${item.id}` },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  const color = qualityColors[item.quality] ?? "#ede7d7";
  const dungeonSource = dungeons.find((d) => d.name === item.source);
  const bisRefs = getBisRefsForItem(item.id);
  const related = items
    .filter((i) => i.id !== item.id && (i.source === item.source || i.slot === item.slot))
    .slice(0, 4);

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/database", label: "Database" },
            { href: `/database/items/${item.id}`, label: item.name },
          ]}
        />
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">{item.type}</span>
            <span
              className="rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider"
              style={{ color, borderColor: `${color}66`, background: `${color}14` }}
            >
              {item.quality}
            </span>
            <span className="text-muted">Seed set · Classic baseline</span>
          </div>

          <h1 className="display mt-5 text-3xl leading-tight md:text-4xl" style={{ color }}>
            {item.name}
          </h1>

          <dl className="panel mt-8 grid grid-cols-2 gap-x-6 gap-y-4 p-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Slot</dt>
              <dd className="mt-1 text-parchment">{item.slot}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Type</dt>
              <dd className="mt-1 text-parchment">{item.type}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Level</dt>
              <dd className="mt-1 text-parchment">{item.level}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Source type
              </dt>
              <dd className="mt-1 text-parchment">{item.sourceType}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wider text-muted">Source</dt>
              <dd className="mt-1 text-parchment">{item.source}</dd>
            </div>
          </dl>

          <p className="mt-8 text-sm leading-relaxed text-muted md:text-base">
            {item.note}
          </p>

          {dungeonSource && (
            <p className="mt-3 text-sm">
              <Link
                href={`/dungeons/${dungeonSource.id}`}
                className="text-gold/90 transition-colors hover:text-gold-soft"
              >
                More about {dungeonSource.name} →
              </Link>
            </p>
          )}

          <div className="panel mt-8 p-5 text-xs leading-relaxed text-muted">
            <p className="font-medium text-parchment">Stats pending verification</p>
            <p className="mt-1">
              Forever-specific stat values and drop rates are confirmed in-game
              after launch. This page lists the item&apos;s identity — name,
              slot, quality, and source — which is stable across the Classic
              baseline.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/database"
              className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Search the database
            </Link>
            <Link
              href="/about#corrections"
              className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Report a correction
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="display text-lg text-parchment">Related items</h2>
              <ul className="mt-4 divide-y divide-line/60">
                {related.map((rel) => (
                  <li key={rel.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <Link
                      href={`/database/items/${rel.id}`}
                      className="transition-colors hover:underline hover:underline-offset-2"
                      style={{ color: qualityColors[rel.quality] ?? "#ede7d7" }}
                    >
                      {rel.name}
                    </Link>
                    <span className="text-xs text-muted">
                      {rel.slot} · {rel.source}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bisRefs.length > 0 && (
            <div className="mt-10">
              <h2 className="display text-lg text-parchment">In BiS checklists</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {bisRefs.map((ref) => {
                  const wowClass = getClass(ref.classId);
                  return wowClass ? (
                    <li key={`${ref.classId}-${ref.specName}`}>
                      <Link
                        href={`/bis/${ref.classId}`}
                        className="text-muted transition-colors hover:text-gold-soft"
                      >
                        {wowClass.name} — {ref.specName} checklist →
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}

          <p className="mt-10 text-xs text-muted/70">
            {site.name} is a fan-made resource. Item names are the property of
            Blizzard Entertainment.
          </p>
        </div>
      </section>
    </main>
  );
}
