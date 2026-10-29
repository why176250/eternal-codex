import raw from "@/data/spells-full.json";

export type DbSpell = {
  id: number;
  name: string;
  school: string;
  icon: string;
  desc: string | null;
};

export const dbSpells = (raw as DbSpell[]).map((spell) => ({
  ...spell,
  icon: spell.icon?.startsWith("http")
    ? spell.icon
    : `https://wow.zamimg.com/images/wow/icons/large/${(spell.icon || "inv_misc_questionmark").replace(/\.(png|webp|jpg)$/i, "")}.jpg`,
}));

export function getDbSpell(id: string | number) {
  return dbSpells.find((spell) => String(spell.id) === String(id));
}

export function searchSpells(query: string, school = "") {
  const q = query.trim().toLowerCase();
  return dbSpells.filter((spell) => {
    if (school && spell.school !== school) return false;
    if (!q) return true;
    return `${spell.name} ${spell.school}`.toLowerCase().includes(q);
  });
}
