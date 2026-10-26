import type { Metadata } from "next";
import Link from "next/link";
import { foreverDungeons } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Dungeon data — Forever instances and routes",
  description:
    "All 45 Forever dungeons, raids, and travel routes with level bands, locations, and notes, imported from the Sargeras community dataset.",
  alternates: { canonical: "/data/dungeons" },
};

export default function ForeverDungeonsPage() {
  const instances = foreverDungeons
    .filter((d) => d.max > 0)
    .sort((a, b) => a.min - b.min || a.name.localeCompare(b.name));
  const routes = foreverDungeons.filter((d) => d.max === 0);
  const dungeons = instances.filter((d) => d.type === "Dungeon" && d.min > 0);
  const raids = instances.filter((d) => d.type === "Raid");

  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Data · Dungeons</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Forever instances and routes
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {foreverDungeons.length} entries, including the new Forever
            instances and travel routes. Names are shown in Chinese and English
            as the source provides them.
          </p>
          <div className="mt-6">
            <ForeverSourceNote />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <h2 className="display text-2xl text-parchment">Dungeons</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dungeons.map((dungeon) => (
              <Link
                key={dungeon.id}
                href={`/data/dungeons/${dungeon.id}`}
                className="panel panel-hover flex gap-4 p-4"
              >
                {dungeon.icon ? (
                  <img
                    src={dungeon.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-md border border-line object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-parchment">{dungeon.nameZh}</span>
                    {dungeon.isNew ? <span className="badge">New</span> : null}
                  </div>
                  <p className="truncate text-xs text-muted">{dungeon.name}</p>
                  <p className="mt-1 text-[11px] text-muted/80">
                    {dungeon.band} · {dungeon.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {raids.length > 0 && (
            <>
              <h2 className="display mt-12 text-2xl text-parchment">Raids</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {raids.map((raid) => (
                  <Link
                    key={raid.id}
                    href={`/data/dungeons/${raid.id}`}
                    className="panel panel-hover flex gap-4 p-4"
                  >
                    {raid.icon ? (
                      <img
                        src={raid.icon}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 shrink-0 rounded-md border border-line object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-sm text-parchment">{raid.nameZh}</p>
                      <p className="text-xs text-muted">{raid.name}</p>
                      <p className="mt-1 text-[11px] text-muted/80">
                        {raid.band} · {raid.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {routes.length > 0 && (
            <>
              <h2 className="display mt-12 text-2xl text-parchment">Travel routes</h2>
              <p className="mt-2 text-sm text-muted">
                New transport links between capitals and starting regions.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {routes.map((route) => (
                  <div key={route.id} className="panel p-4 text-sm">
                    <p className="text-parchment">{route.nameZh}</p>
                    <p className="mt-1 text-xs text-muted">{route.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
