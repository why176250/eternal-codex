import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getGuides } from "@/lib/guides";
import { bisClasses, classes, dungeons, items } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/bis`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/classes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/database`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/dungeons`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
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

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...classRoutes,
    ...bisRoutes,
    ...itemRoutes,
    ...dungeonRoutes,
  ];
}
