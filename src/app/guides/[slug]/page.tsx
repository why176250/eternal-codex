import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, getGuideSlugs, getRelatedGuides } from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `${site.url}/guides/${guide.slug}`,
      publishedTime: guide.date,
      modifiedTime: guide.updated,
      tags: guide.tags,
    },
  };
}

const confidenceStyles: Record<
  string,
  { label: string; className: string }
> = {
  verified: { label: "Verified in build", className: "badge badge-teal" },
  community: { label: "Community-tracked", className: "badge" },
  seed: { label: "Classic baseline", className: "badge" },
};

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide.slug);
  const confidence = confidenceStyles[guide.confidence] ?? confidenceStyles.seed;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/guides/${guide.slug}`,
    articleSection: guide.category,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/guides", label: "Guides" },
            { href: `/guides/${guide.slug}`, label: guide.title },
          ]}
        />
      </div>

      <article className="container-x grid gap-12 pb-20 pt-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <header>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="badge">{guide.category}</span>
              <span className={confidence.className}>{confidence.label}</span>
            </div>
            <h1 className="display mt-5 text-3xl leading-tight text-parchment md:text-4xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {guide.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>Updated {guide.updated}</span>
              <span aria-hidden="true">·</span>
              <span>{guide.readingTime} min read</span>
              <span aria-hidden="true">·</span>
              <span>{guide.words} words</span>
            </div>
          </header>

          <div className="gold-rule my-8" />

          <div
            className="prose prose-infinite prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: guide.html }}
          />

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Spotted an error?</p>
            <p className="mt-1">
              This site is fan-made and corrected in public. If a number, zone,
              or mechanic changed in a patch,{" "}
              <Link href="/about#corrections" className="text-gold/90 hover:text-gold-soft">
                send a correction
              </Link>{" "}
              and it will be noted in the guide&apos;s update line.
            </p>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="display text-xl text-parchment">Keep reading</h2>
              <ul className="mt-4 divide-y divide-line/60">
                {related.map((item) => (
                  <li key={item.slug} className="py-4">
                    <Link
                      href={`/guides/${item.slug}`}
                      className="text-sm text-parchment transition-colors hover:text-gold-soft"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {guide.toc.length > 0 && (
              <nav aria-label="On this page" className="panel p-5">
                <p className="eyebrow">On this page</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {guide.toc.map((entry) => (
                    <li
                      key={entry.id}
                      className={entry.depth === 3 ? "pl-4" : undefined}
                    >
                      <a
                        href={`#${entry.id}`}
                        className="text-muted transition-colors hover:text-gold-soft"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="panel p-5 text-xs leading-relaxed text-muted">
              <p className="eyebrow">Data confidence</p>
              <p className="mt-3">
                <span className={confidence.className}>{confidence.label}</span>
              </p>
              <p className="mt-3">
                Every claim in this guide carries a confidence level. We do not
                republish leak-based data.
              </p>
            </div>
          </div>
        </aside>
      </article>
    </main>
  );
}
