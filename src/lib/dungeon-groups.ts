import raw from "@/data/dungeons-by-level.json";
import dungeons from "@/data/forever/dungeons.json";
import dungeonImages from "@/data/dungeon-images.json";

type RawDungeon = { slug: string; name: string; levelMin: number; levelMax: number };
type RawGroup = { group: string; dungeons: RawDungeon[] };
type Raw = { total: number; levelGroups: RawGroup[] };

const idBySlug: Record<string, string> = {
  "sunken-temple": "st",
  "stratholme-main-gate": "stratlive",
  "stratholme-service-gate": "stratud",
  "kroldok-stronghold": "kroldok",
};

const byId = new Map((dungeons as { id: string }[]).map((dungeon) => [dungeon.id, dungeon]));
const byName = new Map(
  (dungeons as { id: string; name: string }[]).map((dungeon) => [
    dungeon.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    dungeon,
  ]),
);

function resolveId(dungeon: RawDungeon): string | null {
  if (idBySlug[dungeon.slug]) return idBySlug[dungeon.slug];
  const key = dungeon.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (byName.get(key) as { id: string } | undefined)?.id ?? null;
}

export type GroupedDungeon = RawDungeon & {
  id: string | null;
  isNew: boolean;
  image: string | null;
  location: string;
  note: string;
};
export type LevelGroup = { group: string; levelMin: number; levelMax: number; dungeons: GroupedDungeon[] };

const groups = (raw as Raw).levelGroups.map((group) => {
  const parsed = group.group.match(/L(\d+)-(\d+)/);
  return {
    group: group.group,
    levelMin: Number(parsed?.[1] ?? 0),
    levelMax: Number(parsed?.[2] ?? 0),
    dungeons: group.dungeons.map((dungeon) => {
      const id = resolveId(dungeon);
      const data = id ? (byId.get(id) as { isNew?: boolean; location?: string; note?: string } | undefined) : undefined;
      return {
        ...dungeon,
        id,
        isNew: Boolean(data?.isNew),
        image: id ? dungeonImages[id as keyof typeof dungeonImages] ?? null : null,
        location: data?.location ?? "",
        note: data?.note ?? "",
      };
    }),
  };
});

export const levelGroups: LevelGroup[] = groups;
export const groupedTotal = groups.reduce((sum, group) => sum + group.dungeons.length, 0);
export const levelBands = [
  { key: "all", label: "All levels", min: 0, max: 99 },
  { key: "13-20", label: "13–20", min: 13, max: 20 },
  { key: "21-30", label: "21–30", min: 21, max: 30 },
  { key: "31-40", label: "31–40", min: 31, max: 40 },
  { key: "41-50", label: "41–50", min: 41, max: 50 },
  { key: "51-60", label: "51–60", min: 51, max: 60 },
] as const;
