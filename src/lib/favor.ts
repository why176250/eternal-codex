import raw from "@/data/favor_list.json";
import names from "@/data/favor-names.en.json";

export type FavorOffer = {
  entryType: number;
  faction: string | null;
  favorCost: number;
  goldCost: number;
  icon: string;
  itemId: number;
  name: string;
  nameCn: string;
  quality: number;
  requireRep: string | null;
  skillLineId: number;
};

const data = raw as { result: FavorOffer[] };
const nameMap = names as Record<string, string>;

export const favorOffers = data.result;

export function favorName(offer: FavorOffer): string {
  return nameMap[offer.nameCn] || offer.name || offer.nameCn;
}

export function getFavorOffers(skillLineId: number): FavorOffer[] {
  return favorOffers.filter((offer) => offer.skillLineId === skillLineId);
}

export function favorCountBySkillLine(): Record<number, number> {
  return favorOffers.reduce<Record<number, number>>((acc, offer) => {
    if (offer.skillLineId) acc[offer.skillLineId] = (acc[offer.skillLineId] ?? 0) + 1;
    return acc;
  }, {});
}
