import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getGuides } from "@/lib/guides";
import { bisClasses, classes, dungeons, items } from "@/lib/data";
import { dataItems, toolItems } from "@/lib/sections";
import { foreverDungeons, foreverGuides, foreverSets } from "@/lib/forever";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/start`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/bis`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/bis/builds`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/classes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/class-finder`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/database`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/search`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.url}/npcs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/items`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/spells`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/races`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/quests`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/map`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/transmog`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/patch-notes`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${site.url}/server-status`, lastModified: now, changeFrequency: "daily", priority: 0.3 },
    { url: `${site.url}/dungeons`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/zh`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/tools/talents`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/tools/xp`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/tools/build`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/tools/builds`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/tools/gear`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/tools/class-popularity`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/data`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/data/dungeons`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/data/sets`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/data/racials`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/data/vendors`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/data/hunter-pets`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/data/abilities`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/guides/professions`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/guides/pvp`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/guides/forever`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const guideRoutes: MetadataRoute.Sitemap = getGuides().map((guide) => ({
    url: `${site.url}/guides/${guide.slug}`,
    lastModified: new Date(guide.updated),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const classRoutes: MetadataRoute.Sitemap = classes.map((wowClass) => ({
    url: `${site.url}/classes/${wowClass.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const itemRoutes: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${site.url}/database/items/${item.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const bisRoutes: MetadataRoute.Sitemap = bisClasses.map((entry) => ({
    url: `${site.url}/bis/${entry.classId}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const dungeonRoutes: MetadataRoute.Sitemap = dungeons.map((dungeon) => ({
    url: `${site.url}/dungeons/${dungeon.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const toolRoutes: MetadataRoute.Sitemap = toolItems
    .filter((tool) => tool.status === "planned")
    .map((tool) => ({
      url: `${site.url}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    }));

  const dataRoutes: MetadataRoute.Sitemap = dataItems
    .filter((item) => item.status === "planned")
    .map((item) => ({
      url: `${site.url}/data/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    }));

  const foreverDungeonRoutes: MetadataRoute.Sitemap = foreverDungeons.map((d) => ({
    url: `${site.url}/data/dungeons/${d.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const foreverSetRoutes: MetadataRoute.Sitemap = foreverSets.map((s) => ({
    url: `${site.url}/data/sets/${s.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const foreverGuideRoutes: MetadataRoute.Sitemap = foreverGuides.map((g) => ({
    url: `${site.url}/guides/forever/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...classRoutes,
    ...bisRoutes,
    ...itemRoutes,
    ...dungeonRoutes,
    ...toolRoutes,
    ...dataRoutes,
    ...foreverDungeonRoutes,
    ...foreverSetRoutes,
    ...foreverGuideRoutes,
  ];
}
