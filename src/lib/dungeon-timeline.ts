import raw from "@/data/dungeons-timeline.json";
import { foreverDungeons } from "@/lib/forever";
import { getDungeonImagePath, getFcDungeon } from "@/lib/dungeon-fc";

type RawDungeon = {
  name: string;
  levelMin: number;
  levelMax: number;
  category: "new" | "classic";
  left: number;
  width: number;
};

const idByName: Record<string, string> = {
  领主大厅: "hot",
  洛丹伦废墟: "rol",
  "挖掘场：湿地": "excavation",
  达拉然城: "cod",
  沉没之城: "dc",
  "Krol'dok Stronghold": "kroldok",
  "Alcaz Prison": "alcaz",
  黑喉要塞: "bh",
  "Shaper's Terrace": "shapers",
  怒焰裂谷: "rfc",
  哀嚎洞穴: "wc",
  死亡矿井: "dm",
  影牙城堡: "sfk",
  黑暗深渊: "bfd",
  暴风城监狱: "stockade",
  诺莫瑞根: "gnomeregan",
  剃刀沼泽: "rfk",
  "血色修道院 - 墓地": "smgy",
  "血色修道院 - 图书馆": "smlib",
  "血色修道院 - 军械库": "smarm",
  剃刀高地: "rfd",
  "血色修道院 - 大教堂": "smcath",
  奥达曼: "uldaman",
  祖尔法拉克: "zf",
  玛拉顿: "maraudon",
  沉没的神庙: "st",
  黑石深渊: "brd",
  "厄运之槌 - 东": "dme",
  黑石塔下层: "lbrs",
  "厄运之槌 - 北": "dmn",
  "厄运之槌 - 西": "dmw",
  通灵学院: "scholo",
  "斯坦索姆（主门）": "stratlive",
  "斯坦索姆（后门）": "stratud",
  黑石塔上层: "ubrs",
};

const englishById = new Map((foreverDungeons as { id: string; name: string }[]).map((dungeon) => [dungeon.id, dungeon.name]));

export type TimelineEntry = RawDungeon & {
  id: string;
  nameEn: string;
  image: string | null;
  row: number;
};

export type TimelineLane = {
  name: string;
  nameEn: string;
  count: number;
  dungeons: TimelineEntry[];
};

function layout(entries: RawDungeon[]): TimelineEntry[] {
  const rows: number[] = [];
  return entries.map((entry) => {
    const end = entry.left + entry.width;
    let row = rows.findIndex((lastEnd) => entry.left > lastEnd + 1.2);
    if (row < 0) {
      row = rows.length;
      rows.push(end);
    } else {
      rows[row] = end;
    }
    const id = idByName[entry.name] ?? "hot";
    const fcDungeon = getFcDungeon(id);
    const fcMap = getDungeonImagePath(fcDungeon?.map ?? null);
    return {
      ...entry,
      id,
      nameEn: englishById.get(id) ?? entry.name,
      image: fcMap ?? null,
      row,
    };
  });
}

const data = raw as {
  axis: { min: number; max: number; ticks: number[] };
  lanes: { name: string; count: number; dungeons: RawDungeon[] }[];
};

export const timelineAxis = data.axis;
export const timelineLanes: TimelineLane[] = data.lanes.map((lane) => ({
  ...lane,
  nameEn: lane.name.includes("Forever") || lane.name.includes("新增") ? "Forever new" : "From Classic",
  dungeons: layout(lane.dungeons),
}));
