import placesRaw from "@/data/map-places.json";
import poisRaw from "@/data/map-pois.json";
import nodesRaw from "@/data/map-nodes.json";

export type MapPlace = { n: string; x: number; y: number; k: number; m: number };
export type MapPoi = { n: string; ne: string; x: number; y: number; c: string; s: number; i: number };

export const mapPlaces = placesRaw.places as MapPlace[];
export const mapPois = poisRaw.pois as MapPoi[];
export const mapNodes = nodesRaw.nodes as Record<string, number[][]>;
export const mapNodeCount = Object.values(mapNodes).reduce((sum, points) => sum + points.length, 0);

export function searchPlaces(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return mapPlaces;
  return mapPlaces.filter((place) => place.n.toLowerCase().includes(q));
}

export function searchPois(query: string, category = "") {
  const q = query.trim().toLowerCase();
  return mapPois.filter((poi) => {
    if (category && poi.c !== category) return false;
    if (!q) return true;
    return `${poi.n} ${poi.ne}`.toLowerCase().includes(q);
  });
}

export function poiCategories() {
  return Array.from(new Set(mapPois.map((poi) => poi.c).filter(Boolean))).sort();
}
