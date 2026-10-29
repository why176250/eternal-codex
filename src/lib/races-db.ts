import raw from "@/data/racials-db.json";

export type RaceAbility = {
  type: string;
  name: string;
  icon: string;
  desc: string;
  info?: string;
};

export type Race = {
  faction: string;
  raceId: number;
  key: string;
  raceZh: string;
  raceIcon: string;
  classIds: number[];
  abilities: RaceAbility[];
};

export const races = raw as Race[];
