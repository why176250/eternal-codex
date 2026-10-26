import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[50vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
        This page never made it through the portal.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        The link may be old, or the page may not be written yet. The guides and
        database are the best places to restart.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/guides"
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-abyss transition-colors hover:bg-gold-soft"
        >
          Browse guides
        </Link>
        <Link
          href="/database"
          className="rounded-lg border border-line px-5 py-2.5 text-sm text-parchment transition-colors hover:border-gold/50"
        >
          Open database
        </Link>
      </div>
    </main>
  );
}
