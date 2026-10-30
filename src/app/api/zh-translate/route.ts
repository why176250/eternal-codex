import { NextResponse } from "next/server";

const cache = new Map<string, string>();
const PROTECTED = ["Eversixty", "Wowhead", "Icy Veins", "World of Warcraft", "Warcraft", "Blizzard", "Forever", "Classic+", "Next.js", "WoW", "DPS", "NPC", "BiS"];

function protect(text: string) {
  let value = text;
  const tokens: string[] = [];
  for (const term of PROTECTED) {
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    value = value.replace(pattern, () => {
      const index = tokens.length;
      tokens.push(term);
      return `[[[${index}]]]`;
    });
  }
  return { value, tokens };
}
export const runtime = "nodejs";

export async function POST(request: Request) {
  const { texts } = (await request.json()) as { texts?: string[] };
  if (!Array.isArray(texts) || texts.length === 0) return NextResponse.json({ translations: [] });
  const unique = [...new Set(texts.filter((t) => typeof t === "string" && t.trim()))].slice(0, 12);
  const translations = await Promise.all(unique.map(async (text) => {
    if (cache.has(text)) return cache.get(text) ?? text;
    try {
      const { value: protectedText, tokens } = protect(text);
      const url = new URL("https://clients5.google.com/translate_a/t");
      url.searchParams.set("client", "dict-chrome-ex");
      url.searchParams.set("sl", "en");
      url.searchParams.set("tl", "zh-CN");
      url.searchParams.set("q", protectedText);
      const response = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "Mozilla/5.0" } });
      const data = (await response.json()) as unknown;
      let value = Array.isArray(data) && typeof data[0] === "string" ? data[0] : text;
      tokens.forEach((term, index) => { value = value.replace(`[[[${index}]]]`, term); });
      cache.set(text, value);
      return value;
    } catch { return text; }
  }));
  return NextResponse.json({ translations });
}
