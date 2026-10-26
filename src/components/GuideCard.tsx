import Link from "next/link";
import type { GuideMeta } from "@/lib/guides";

export function GuideCard({ guide }: { guide: GuideMeta }) {
  return (
    <article className="panel panel-hover flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="badge">{guide.category}</span>
        <span className="text-[11px] text-muted">{guide.readingTime} min read</span>
      </div>
      <h3 className="display mt-4 text-lg leading-snug text-parchment">
        <Link
          href={`/guides/${guide.slug}`}
          className="transition-colors hover:text-gold-soft"
        >
          {guide.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
        {guide.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted">
        <span>Updated {guide.updated}</span>
        <Link
          href={`/guides/${guide.slug}`}
          className="text-gold/90 transition-colors hover:text-gold-soft"
        >
          Read guide →
        </Link>
      </div>
    </article>
  );
}
