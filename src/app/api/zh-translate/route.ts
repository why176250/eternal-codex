import { NextResponse } from "next/server";

function postProcess(value: string) {
  const fixes: [RegExp, string][] = [
    [/规格指南/g, "专精攻略"], [/规格/g, "专精"], [/老板们/g, "首领"], [/老板/g, "首领"], [/头目/g, "首领"],
    [/战利品/g, "掉落"], [/地牢/g, "副本"], [/达到水平/g, "升级难度"], [/额外来源/g, "其他来源"],
    [/大满贯/g, "猛击"], [/压倒/g, "压制"], [/防守姿态/g, "防御姿态"], [/攻击力/g, "攻击强度"],
    [/(\d+)\s*滴/g, "$1 件掉落"], [/\b bosses\b/gi, "首领"], [/\b boss\b/gi, "首领"], [/\b loot\b/gi, "掉落"],
    [/\b Waist\b/gi, "腰部"], [/\b Wrist\b/gi, "手腕"], [/\b Hands\b/gi, "手"], [/\b Feet\b/gi, "脚"], [/\b Legs\b/gi, "腿部"], [/\b Chest\b/gi, "胸部"], [/\b Head\b/gi, "头部"], [/\b Shoulder\b/gi, "肩部"],
    [/\b Cloth\b/gi, "布甲"], [/\b Leather\b/gi, "皮甲"], [/\b Mail\b/gi, "锁甲"], [/\b Plate\b/gi, "板甲"],
  ];
  let out = value;
  for (const [re, text] of fixes) out = out.replace(re, text);
  return out;
}

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
      value = postProcess(value);
      cache.set(text, value);
      return value;
    } catch { return text; }
  }));
  return NextResponse.json({ translations });
}
