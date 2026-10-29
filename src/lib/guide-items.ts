import guides from "@/data/forever/guides.en.json";

export type GuideItem = {
  id: number;
  name: string;
  name_en: string | null;
  nameCn: string | null;
  icon: string;
  item_level: number;
  quality: number;
};

const rows: (GuideItem & { guide: string })[] = [];
for (const guide of guides) {
  for (const item of guide.items ?? []) {
    if (!rows.some((row) => row.id === item.id)) {
      rows.push({ ...item, guide: guide.slug });
    }
  }
}

export const guideItems = rows;

export function getGuideItem(id: string | number) {
  return rows.find((item) => String(item.id) === String(id));
}
