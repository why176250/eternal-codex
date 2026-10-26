import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foreverDungeons } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return foreverDungeons.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dungeon = foreverDungeons.find((d) => d.id === slug);
  if (!dungeon) return { title: "Dungeon not found" };
  return {
    title: `${dungeon.nameZh} ${dungeon.name} — dungeon data`,
    description: dungeon.desc || dungeon.note,
    alternates: { canonical: `/data/dungeons/${dungeon.id}` },
  };
}

export default async function ForeverDungeonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const dungeon = foreverDungeons.find((d) => d.id === slug);
  if (!dungeon) notFound();

  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/data" className="hover:text-gold-soft">Data</Link>{" "}
        /{" "}
        <Link href="/data/dungeons" className="hover:text-gold-soft">Dungeons</Link>{" "}
        / <span className="text-parchment/80">{dungeon.nameZh}</span>
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">{dungeon.type}</span>
            <span className="rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-gold-soft">
              {dungeon.band}
            </span>
            {dungeon.isNew ? <span className="badge">New in Forever</span> : null}
          </div>

          <div className="mt-5 flex items-start gap-5">
            {dungeon.icon ? (
              <img
                src={dungeon.icon}
                alt=""
                width={96}
                height={96}
                className="size-24 shrink-0 rounded-lg border border-line object-cover"
              />
            ) : null}
            <div>
              <h1 className="display text-3xl text-parchment md:text-4xl">
                {dungeon.nameZh}
              </h1>
              <p className="mt-1 text-base text-muted">{dungeon.name}</p>
            </div>
          </div>

          {dungeon.desc ? (
            <p className="mt-6 text-sm leading-relaxed text-muted md:text-base">
              {dungeon.desc}
            </p>
          ) : null}

          <dl className="panel mt-8 grid grid-cols-2 gap-4 p-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Level band</dt>
              <dd className="mt-1 text-parchment">{dungeon.band}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Location</dt>
              <dd className="mt-1 text-parchment">{dungeon.location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Side</dt>
              <dd className="mt-1 text-parchment">{dungeon.side || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Abbreviation</dt>
              <dd className="mt-1 text-parchment">{dungeon.abbr || "—"}</dd>
            </div>
          </dl>

          {dungeon.note ? (
            <div className="panel mt-6 p-5 text-sm leading-relaxed text-muted">
              <p className="font-medium text-parchment">Note</p>
              <p className="mt-1">{dungeon.note}</p>
            </div>
          ) : null}

          <div className="mt-8">
            <ForeverSourceNote />
          </div>

          <Link
            href="/data/dungeons"
            className="mt-8 inline-block rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-parchment"
          >
            All dungeons
          </Link>
        </div>
      </section>
    </main>
  );
}
