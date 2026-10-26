import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dataItems } from "@/lib/sections";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Params = { slug: string };

const planned = dataItems.filter((item) => item.status === "planned");

export function generateStaticParams(): Params[] {
  return planned.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = planned.find((entry) => entry.slug === slug);
  if (!item) return { title: "Dataset not found" };
  return {
    title: `${item.label} — planned`,
    description: `${item.label} for World of Warcraft: Forever. ${item.summary}`,
    alternates: { canonical: `/data/${item.slug}` },
  };
}

export default async function DataItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const item = planned.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/data", label: "Data" },
            { href: `/data/${item.slug}`, label: item.label },
          ]}
        />
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">Planned</span>
            <span className="text-muted">{item.zh}</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            {item.label}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {item.summary}
          </p>

          <div className="gold-rule my-8" />

          <h2 className="display text-xl text-parchment">What will be here</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="panel mt-8 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Status</p>
            <p className="mt-1">
              This dataset is still being verified in-game. Live data pages are
              linked from the{" "}
              <Link href="/data" className="text-gold/90 hover:text-gold-soft">
                Data hub
              </Link>
              ; everything else here is a plan, not a placeholder table.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/data"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              All data
            </Link>
            <Link
              href="/database"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Item database
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
