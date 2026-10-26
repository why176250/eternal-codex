import { marked } from "marked";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TocEntry = {
  depth: 2 | 3;
  text: string;
  id: string;
};

/** Pull h2/h3 headings straight from the markdown source. */
export function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split("\n");
  const entries: TocEntry[] = [];
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1");
    entries.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugify(text),
    });
  }
  return entries;
}

/**
 * Render markdown to HTML and add stable ids to h2/h3 so the TOC can link
 * to them. marked does not emit heading ids on its own.
 */
export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { gfm: true, breaks: false }) as string;
  return html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_match, depth: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      const id = slugify(text);
      return `<h${depth} id="${id}">${inner}</h${depth}>`;
    },
  );
}
