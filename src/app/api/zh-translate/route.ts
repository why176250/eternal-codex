import { NextResponse } from "next/server";
import glossary from "@/data/zh-proper.json";

function postProcess(value: string) {
  const fixes: [RegExp, string][] = [
    [/规格指南/g, "专精攻略"], [/规格/g, "专精"], [/老板们/g, "首领"], [/老板/g, "首领"], [/头目/g, "首领"],
    [/Arms套件/g, "武器"], [/\bArms\b/gi, "武器"], [/Fury/g, "狂怒"], [/Protection/g, "防护"], [/Retribution/g, "惩戒"],
    [/邮件/g, "锁甲"], [/皮革/g, "皮甲"], [/布料/g, "布甲"], [/高难度升级难度/g, "升级难度高"], [/^(\d+)滴$/g, "$1 掉落"], [/滴/g, "掉落"],
    [/战利品/g, "掉落"], [/地牢/g, "副本"], [/达到水平/g, "升级难度"], [/额外来源/g, "其他来源"],
    [/大满贯/g, "猛击"], [/压倒/g, "压制"], [/防守姿态/g, "防御姿态"], [/攻击力/g, "攻击强度"],
    [/(\d+)\s*滴/g, "$1 件掉落"], [/\b bosses\b/gi, "首领"], [/\b boss\b/gi, "首领"], [/\bbosses\b/gi, "首领"], [/\bboss\b/gi, "首领"], [/\b loot\b/gi, "掉落"],
    [/\b Strength\b/gi, "力量"], [/\b Agility\b/gi, "敏捷"], [/\b Stamina\b/gi, "耐力"], [/\b Intellect\b/gi, "智力"], [/\b Spirit\b/gi, "精神"], [/\b Attack Power\b/gi, "攻击强度"], [/\b Spell Power\b/gi, "法术强度"], [/\b Critical Strike\b/gi, "爆击"], [/\b Hit\b/gi, "命中"], [/\b Haste\b/gi, "急速"], [/\b Defense\b/gi, "防御"], [/\b Dodge\b/gi, "闪避"], [/\b Parry\b/gi, "招架"], [/\b Block\b/gi, "格挡"],
    [/\b Waist\b/gi, "腰部"], [/\b Wrist\b/gi, "手腕"], [/\b Hands\b/gi, "手"], [/\b Feet\b/gi, "脚"], [/\b Legs\b/gi, "腿部"], [/\b Chest\b/gi, "胸部"], [/\b Head\b/gi, "头部"], [/\b Shoulder\b/gi, "肩部"],
    [/\b Cloth\b/gi, "布甲"], [/\b Leather\b/gi, "皮甲"], [/\b Mail\b/gi, "锁甲"], [/\b Plate\b/gi, "板甲"],
  ];
  let out = value;
  for (const [re, text] of fixes) out = out.replace(re, text);
  out = out
    .replace(/高难度升级难度/g, "升级难度高")
    .replace(/暴风雪/g, "暴雪")
    .replace(/武器和天赋/g, "法术和天赋")
    .replace(/类别/g, "职业")
    .replace(/覆盖/g, "涵盖")
    .replace(/构建/g, "版本")
    .replace(/设置数据/g, "套装数据")
    .replace(/魔法/g, "法术")
    .replace(/姓名/g, "名称")
    .replace(/学校/g, "法术学派")
    .replace(/槽位/g, "部位")
    .replace(/质量/g, "品质")
    .replace(/给予者/g, "任务给予者")
    .replace(/天生选项/g, "种族天赋")
    .replace(/Eversixty额外/g, "其他")
    .replace(/(\d+)专精攻略/g, "$1 篇专精攻略")
    .replace(/(\d+)个首领/g, "$1 个首领")
    .replace(/(\d+)掉落/g, "$1 件掉落")
    .replace(/走之前/g, "出发前")
    .replace(/Forever更改地图/g, "Forever 地图改动")
    .replace(/地图\s*可用的/g, "地图可用")
    .replace(/锁甲盔甲/g, "锁甲护甲")
    .replace(/皮甲盔甲/g, "皮甲护甲")
    .replace(/布甲盔甲/g, "布甲护甲")
    .replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, "$1");
  return out;
}

const cache = new Map<string, string>();
const PROTECTED = ["Eversixty", "Wowhead", "Icy Veins", "World of Warcraft", "Warcraft", "Blizzard", "Forever", "FOREVER", "Classic+", "CLASSIC+", "Next.js", "WoW", "DPS", "NPC", "BiS"];

function protect(text: string) {
  let value = text;
  const tokens: string[] = [];
  const terms: [string, string][] = [
    ...Object.entries(glossary as Record<string, string>),
    ...PROTECTED.map((term) => [term, term] as [string, string]),
  ].sort((a, b) => b[0].length - a[0].length);
  for (const [term, chinese] of terms) {
    if (!value.includes(term)) continue;
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    value = value.replace(pattern, () => {
      const index = tokens.length;
      tokens.push(chinese);
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
