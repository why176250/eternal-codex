import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractToc, renderMarkdown, type TocEntry } from "./markdown";

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  updated: string;
  tags: string[];
  featured: boolean;
  confidence: "verified" | "community" | "seed";
  words: number;
  readingTime: number;
};

export type Guide = GuideMeta & {
  markdown: string;
  html: string;
  toc: TocEntry[];
};

const guidesDir = path.join(process.cwd(), "content", "guides");

function parseFile(fileName: string): Guide {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(guidesDir, fileName), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(2, Math.round(words / 210));

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    category: String(data.category ?? "Guides"),
    date: String(data.date ?? "2026-10-26"),
    updated: String(data.updated ?? data.date ?? "2026-10-26"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    confidence: (data.confidence ?? "community") as GuideMeta["confidence"],
    words,
    readingTime,
    markdown: content,
    html: renderMarkdown(content),
    toc: extractToc(content),
  };
}

let cache: Guide[] | null = null;

export function getGuides(): Guide[] {
  if (cache) return cache;
  if (!fs.existsSync(guidesDir)) return (cache = []);
  cache = fs
    .readdirSync(guidesDir)
    .filter((f) => f.endsWith(".md"))
    .map(parseFile)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.date.localeCompare(a.date);
    });
  return cache;
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((g) => g.slug === slug);
}

export function getGuideSlugs(): string[] {
  return getGuides().map((g) => g.slug);
}

export function getRelatedGuides(slug: string, limit = 3): GuideMeta[] {
  const all = getGuides();
  const current = all.find((g) => g.slug === slug);
  if (!current) return all.slice(0, limit).map(strip);
  const sameCategory = all.filter(
    (g) => g.slug !== slug && g.category === current.category,
  );
  const rest = all.filter(
    (g) => g.slug !== slug && g.category !== current.category,
  );
  return [...sameCategory, ...rest].slice(0, limit).map(strip);
}

function strip(g: Guide): GuideMeta {
  const { markdown, html, toc, ...meta } = g;
  void markdown;
  void html;
  void toc;
  return meta;
}
