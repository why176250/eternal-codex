import fs from "node:fs";
import path from "node:path";
import spellbooks from "@/data/scarlet/spellbooks.json";
import racials from "@/data/scarlet/racials.json";
import classRacial from "@/data/scarlet/class_racial.json";
import talents from "@/data/forever/talents.json";

export type SkillInfo = {
  name: string;
  icon: string;
  description: string;
};

const byName = new Map<string, SkillInfo>();
const iconDir = path.join(process.cwd(), "public", "talents", "icons");
const fallbackIcon = "inv_misc_questionmark";

function cleanIcon(icon: string) {
  return icon.replace(/\.jpg$/i, "");
}

function add(
  name: string | undefined,
  icon: string | undefined,
  description: string | undefined,
  override = false,
) {
  if (!name || !icon) return;
  const cleanName = name.trim();
  const clean = cleanIcon(icon);
  if (!cleanName || !clean) return;
  if (!byName.has(cleanName) || override) {
    byName.set(cleanName, {
      name: cleanName,
      icon: clean,
      description: description?.trim() ?? "",
    });
  }
}

function walk(value: unknown) {
  if (Array.isArray(value)) {
    value.forEach(walk);
    return;
  }
  if (!value || typeof value !== "object") return;
  const row = value as Record<string, unknown>;
  const icon = row.icon as string | undefined;
  const zhName =
    (row.nameCn as string | undefined) ??
    (row.abilityNameCn as string | undefined);
  const enName =
    (row.name as string | undefined) ??
    (row.abilityName as string | undefined);
  const zhDescription =
    (row.descCn as string | undefined) ??
    (row.abilityDescCn as string | undefined) ??
    (row.description as string | undefined);
  const enDescription =
    (row.descEn as string | undefined) ??
    (row.abilityDesc as string | undefined) ??
    zhDescription;
  if (zhName) add(zhName, icon, zhDescription);
  if (enName) add(enName, icon, enDescription);
  Object.values(row).forEach(walk);
}

walk(spellbooks);
walk(racials);
walk(classRacial);

for (const wowClass of talents) {
  for (const tree of wowClass.trees) {
    for (const talent of tree.talents) {
      const ranksZh = (talent.ranks ?? [])
        .map((rank) => rank.zh || rank.en)
        .filter(Boolean)
        .join("\n");
      const ranksEn = (talent.ranks ?? [])
        .map((rank) => rank.en || rank.zh)
        .filter(Boolean)
        .join("\n");
      add(talent.name, talent.icon, ranksZh);
      add(talent.nameEn, talent.icon, ranksEn, true);
    }
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const normalized = new Map<string, SkillInfo>();
for (const info of byName.values()) {
  if (!normalized.has(normalize(info.name))) normalized.set(normalize(info.name), info);
}

function lookup(name: string) {
  return byName.get(name) ?? normalized.get(normalize(name));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function decorateSkillMarkers(html: string): string {
  return html.replace(/【([^】]{1,40})】/g, (match, rawName: string) => {
    const name = rawName.trim();
    const info = lookup(name);
    const icon = info && fs.existsSync(path.join(iconDir, `${info.icon}.jpg`))
      ? info.icon
      : fallbackIcon;
    const desc = encodeURIComponent(info?.description ?? "");
    return `<span class="inline-skill" role="button" tabindex="0" data-skill="${escapeHtml(
      name,
    )}" data-skill-icon="/talents/icons/${icon}.jpg" data-skill-desc="${desc}" title="${escapeHtml(
      name,
    )}"><img src="/talents/icons/${icon}.jpg" alt="" loading="lazy" />${match}</span>`;
  });
}

export function getSkillInfo(name: string): SkillInfo | undefined {
  return byName.get(name);
}
