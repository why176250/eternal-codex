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

        {guide.items && guide.items.length > 0 ? (
          <section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="display text-lg text-parchment">Items in this guide</h2>
              <span className="text-[11px] text-muted">{guide.items.length} links</span>
            </div>
            <p className="mt-1 text-xs text-muted">Open any item for its database page.</p>
            <div className="mt-3 grid max-h-96 gap-2 overflow-y-auto sm:grid-cols-2">
              {guide.items.map((item) => (
                <Link key={item.id} href={`/items/${item.id}`} className="panel flex items-center gap-2 p-2.5 transition-colors hover:border-gold/40">
                  {item.icon ? <img src={item.icon} alt="" width={28} height={28} className="size-7 rounded border border-line/70" /> : null}
                  <span className="min-w-0">
                    <span className="block truncate text-xs text-parchment">{item.name_en || item.name}</span>
                    <span className="block text-[10px] text-muted">iLvl {item.item_level} · Item #{item.id}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

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
