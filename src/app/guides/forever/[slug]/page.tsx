import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foreverGuides } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return foreverGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = foreverGuides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: `${guide.title} — ${guide.titleEn}`,
    description: guide.description,
    alternates: { canonical: `/guides/forever/${guide.slug}` },
  };
}

export default async function ForeverGuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = foreverGuides.find((g) => g.slug === slug);
  if (!guide) notFound();
  const related = foreverGuides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/guides" className="hover:text-gold-soft">Guides</Link>{" "}
        /{" "}
        <Link href="/guides/forever" className="hover:text-gold-soft">Forever imports</Link>{" "}
        / <span className="text-parchment/80">{guide.title}</span>
      </div>

      <article className="container-x max-w-3xl pb-20 pt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="badge">{guide.category || "Guide"}</span>
          <span className="text-muted">Imported · Sargeras</span>
          <span className="text-muted/60">
            Updated{" "}
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(guide.updated))}
          </span>
        </div>
        <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{guide.titleEn}</p>
        {guide.subtitle ? (
          <p className="mt-1 text-xs text-muted/80">{guide.subtitle}</p>
        ) : null}
        <p className="mt-4 text-base leading-relaxed text-muted">
          {guide.description}
        </p>

        <div className="gold-rule my-8" />

        <div
          className="prose prose-infinite prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.html }}
        />

        <div className="mt-10">
          <ForeverSourceNote />
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="display text-lg text-parchment">More imported guides</h2>
            <ul className="mt-3 divide-y divide-line/50">
              {related.map((g) => (
                <li key={g.slug} className="py-3">
                  <Link
                    href={`/guides/forever/${g.slug}`}
                    className="text-sm text-parchment transition-colors hover:text-gold-soft"
                  >
                    {g.title} <span className="text-xs text-muted">· {g.titleEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </main>
  );
}
