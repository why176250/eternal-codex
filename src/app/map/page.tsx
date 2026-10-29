import type { Metadata } from "next";
import Link from "next/link";
import { mapNodeCount, mapPlaces, poiCategories, searchPlaces, searchPois } from "@/lib/map-db";

export const metadata: Metadata = {
  title: "Map — zones, places, and points of interest",
  description: "Search Forever map places and points of interest, with coordinates and resource-node counts.",
  alternates: { canonical: "/map" },
};

type SearchParams = Promise<{ q?: string; c?: string }>;

export default async function MapPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const category = params.c ?? "";
  const places = searchPlaces(query).slice(0, 80);
  const pois = searchPois(query, category).slice(0, 120);
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Database · Map</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Map & points of interest</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Search zones, towns, dungeons, quest givers, and other points of
            interest. Coordinates are from the current map import.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">{mapPlaces.length} places</span>
            <span className="rounded-full border border-line/80 px-3 py-1">{mapNodeCount.toLocaleString("en-US")} resource nodes</span>
          </div>
        </div>
      </section>
      <section className="container-x py-8 md:py-10">
        <form method="get" className="panel flex flex-wrap items-center gap-2 p-4">
          <input name="q" defaultValue={query} placeholder="Search place, zone, NPC" className="min-w-56 flex-1 rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
          <select name="c" defaultValue={category} className="rounded-lg border border-line bg-deep px-3 py-2 text-sm text-parchment">
            <option value="">All POI types</option>
            {poiCategories().map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <button className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">Search</button>
        </form>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="panel p-4">
            <h2 className="display text-xl text-parchment">Places</h2>
            <div className="mt-3 max-h-[32rem] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line text-[10px] uppercase tracking-wider text-muted"><tr><th className="py-2 font-normal">Place</th><th className="py-2 text-right font-normal">X</th><th className="py-2 text-right font-normal">Y</th></tr></thead>
                <tbody>{places.map((place) => <tr key={`${place.m}-${place.n}-${place.x}-${place.y}`} className="border-b border-line/40"><td className="py-2 text-parchment">{place.n}</td><td className="py-2 text-right text-muted">{place.x}</td><td className="py-2 text-right text-muted">{place.y}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
          <div className="panel p-4">
            <h2 className="display text-xl text-parchment">Points of interest</h2>
            <p className="mt-1 text-[11px] text-muted">{pois.length} shown</p>
            <div className="mt-3 max-h-[32rem] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line text-[10px] uppercase tracking-wider text-muted"><tr><th className="py-2 font-normal">POI</th><th className="py-2 font-normal">Type</th><th className="py-2 text-right font-normal">X</th><th className="py-2 text-right font-normal">Y</th></tr></thead>
                <tbody>{pois.map((poi) => <tr key={`${poi.i}-${poi.x}-${poi.y}`} className="border-b border-line/40"><td className="py-2 text-parchment">{poi.ne || poi.n}</td><td className="py-2 text-muted">{poi.c}</td><td className="py-2 text-right text-muted">{poi.x}</td><td className="py-2 text-right text-muted">{poi.y}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
        <Link href="/map" className="mt-4 inline-block text-xs text-gold/80">Reset filters →</Link>
      </section>
    </main>
  );
}
