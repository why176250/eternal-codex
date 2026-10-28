import fs from "node:fs";
import path from "node:path";
import spellbooks from "@/data/scarlet/spellbooks.json";
import talents from "@/data/forever/talents.json";

type Spellbook = Record<
  string,
  {
    result?: {
      tabs?: {
        spells?: { nameCn?: string; name?: string; icon?: string }[];
      }[];
    };
  }
>;

const iconByName = new Map<string, string>();

function add(name: string | undefined, icon: string | undefined) {
  if (!name || !icon) return;
  const cleanName = name.trim();
  const cleanIcon = icon.replace(/\.jpg$/i, "");
  if (!cleanName || !cleanIcon) return;
  if (!iconByName.has(cleanName)) iconByName.set(cleanName, cleanIcon);
}

for (const entry of Object.values(spellbooks as Spellbook)) {
  for (const tab of entry.result?.tabs ?? []) {
    for (const spell of tab.spells ?? []) {
      add(spell.nameCn, spell.icon);
      add(spell.name, spell.icon);
    }
  }
}

for (const wowClass of talents) {
  for (const tree of wowClass.trees) {
    for (const talent of tree.talents) {
      add(talent.name, talent.icon);
      add(talent.nameEn, talent.icon);
    }
  }
}

const iconDir = path.join(process.cwd(), "public", "talents", "icons");

export function decorateSkillMarkers(html: string): string {
  return html.replace(/【([^】]{1,40})】/g, (match, rawName: string) => {
    const icon = iconByName.get(rawName.trim());
    if (!icon) return match;
    if (!fs.existsSync(path.join(iconDir, `${icon}.jpg`))) return match;
    return `<span class="inline-skill"><img src="/talents/icons/${icon}.jpg" alt="" loading="lazy" />${match}</span>`;
  });
}
