"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const exact: Record<string, string> = {
  "Latest balance changes": "最近一次平衡调整",
  "October 28, 2026": "2026年10月28日",
  "View details": "查看详情",
  "START HERE": "从这里开始",
  "Three steps": "三个步骤",
  "Pick a class": "选择职业",
  "Browse builds": "浏览天赋",
  "Browse gear": "浏览装备",
  "Five questions, one class and race.": "五个问题，选出职业和种族。",
  "Start from a proven build, then make it yours.": "从成熟的 build 开始，再改成自己的。",
  "See what other players are wearing.": "看看其他玩家在穿什么。",
  "Open": "打开",
  "OPEN": "打开",
  "Six modules live": "六大模块已上线",
  "No account, no paywall": "无需账号，无付费墙",
  "A Forever companion": "Forever 伴侣",
  "GLOBAL LAUNCH": "全球上线", "Nov 4 · 3 PM PT · Nov 5 · 07:00 CST": "11月4日 · 太平洋时间下午3点 · 11月5日 07:00 CST",
  "DAYS": "天", "HOURS": "小时", "MINUTES": "分钟", "SECONDS": "秒",
  "Build planner": "天赋模拟器", "Talents + legacy": "天赋 + 传承",
  "Gear plan": "装备计划", "All-class BiS": "全职业 BiS",
  "Class guides": "职业攻略", "28 spec guides": "28 篇专精攻略",
  "Dungeons & loot": "副本与掉落", "Level bands & drops": "等级段与掉落",
  "Professions": "专业", "Pairings & recipes": "配方与搭配",
  "Experience calculator": "经验计算器", "1–60 XP math": "1–60 经验",
  "DATA": "数据库", "CLASS POPULARITY": "职业热度", "SPEC RANKINGS": "专精强度", "Items": "物品", "Spells": "法术", "Sets": "套装", "NPCs": "NPC", "Map": "地图",
  "Search": "搜索", "Launch class popularity": "开服职业人气",
  "Tier List · spec strength": "职业强度榜",
  "DPS": "DPS", "Tank": "坦克", "Healer": "治疗",
  "Tools": "工具", "Data": "数据", "Guides": "攻略",
  "All tools": "全部工具",
  "Sections": "板块", "Editorial": "编辑",
  "How we verify data": "我们如何核实数据", "Report a correction": "报告错误",
  "Privacy": "隐私政策", "Terms": "条款与免责", "Contact": "联系与纠错",
  "pages": "页面", "items": "物品", "spells": "法术", "sets": "套装", "votes": "票", "specs": "专精",
  "Overview": "概述", "Changes": "变化", "Pros & cons": "优劣势", "Races": "种族",
  "Abilities": "技能", "BiS": "BiS", "Dungeons": "副本", "Classes": "职业",
  "FOREVER · CLASSIC+": "FOREVER · CLASSIC+",
  "The Hall of Thanes": "领主之厅",
  "滴": "掉落", "邮件": "锁甲", "皮革": "皮甲", "布料": "布甲", "Arms": "武器", "Arms套件": "武器",
  "高难度升级难度": "升级难度高",
  "Every spec, one page": "每个专精，一页看完",
  "Home": "首页", "Item details": "物品详情", "Sells for": "出售价格", "Requires level": "需要等级",
  "Rare": "稀有", "Uncommon": "优秀", "Epic": "史诗", "Legendary": "传说", "Neck": "颈部", "Finger": "手指", "Trinket": "饰品", "Back": "背部", "Chest": "胸部", "Waist": "腰部", "Legs": "腿部", "Feet": "脚", "Wrist": "手腕", "Hands": "手", "Head": "头部", "Shoulder": "肩部", "Shield": "盾牌", "Off-hand": "副手", "One-Hand": "单手", "Two-Hand": "双手", "Ranged": "远程",
  "DUNGEON": "副本", "LEVEL": "等级",

  "DATABASE · ITEMS": "数据库 · 物品",
  "Item database": "物品数据库",
  "Search 7,823 Forever items by name, type, and slot. Names, quality, and item level are imported from the Blue Hermit dataset.": "按名称、类型和部位搜索 7,823 件 Forever 物品。名称、品质与物品等级来自蓝色隐士数据。",
  "All types": "全部类型", "Armor": "护甲", "Weapon": "武器", "Consumable": "消耗品", "Container": "容器", "Reagent": "材料", "Quest": "任务", "Trade Goods": "贸易品",
  "Blue Hermit": "蓝色隐士",

  "Nine classes, 28 specs. Pick a class, then a spec: overview, what changed, pros and cons, race recommendations, and professions.": "九大职业、28 个专精。选择职业后再选专精：概述、变化、优劣势、种族推荐与专业建议。",
  "Not sure? Take the class finder": "不确定？做个职业测试",
  "9 classes": "9 个职业", "5 core sections": "5 个核心板块",
  "DEMANDING": "高难度", "MODERATE": "中等", "EASY": "简单",
  "TANK": "坦克", "HEALER": "治疗",
  "Class overview": "职业概览",
  "Dungeons in Forever": "Forever 副本",
  "Forever adds nine dungeons between levels 13 and 60, alongside 26 Classic dungeons. Hover a bar for details, or open a dungeon for its bosses and loot.": "Forever 在 13–60 级新增九个副本，并保留 26 个经典副本。悬停查看详情，或打开副本查看首领与掉落。",
  "9 new dungeons": "9 个新副本", "26 from Classic": "26 个经典副本", "218 recorded bosses": "218 个已记录首领",
  "BOSSES & LOOT": "首领与掉落", "Open a dungeon": "打开副本",
  "Jump straight to its bosses and loot table.": "直接查看首领与掉落表。",
  "Select a dungeon": "选择副本", "New": "新副本",
  "Spec guides": "专精攻略", "Class abilities": "职业技能", "What changed": "改动内容",
  "All classes": "全部职业", "The baseline tank: no self-heals, rage economy, unmatched group demand.": "经典坦克基准：没有自疗，依靠怒气，团队需求极高。",
  "The flexible healer: blessings, auras, and strong group utility.": "灵活的治疗者：祝福、光环与强大的团队辅助。",
  "The ranged specialist: pets, traps, and the best solo leveling.": "远程专家：宠物、陷阱与最强单刷练级。",
  "The stealth assassin: burst damage, locks, and pickpocket utility.": "潜行刺客：爆发伤害、控制与偷窃辅助。",
  "The dedicated healer: strong single-target and group healing.": "专职治疗：强大的单体与群体治疗。",
  "The totem support: healing, elemental damage, and group buffs.": "图腾辅助：治疗、元素伤害与团队增益。",
  "The spellcaster: portals, crowd control, and burst magic.": "施法者：传送门、控制与爆发法术。",
  "The dark caster: curses, demons, and sustained damage.": "暗影施法者：诅咒、恶魔与持续伤害。",
  "The shapeshifter: tanking, healing, and ranged damage in one class.": "变形者：一个职业兼顾坦克、治疗与远程输出。",

};

const phrase: [RegExp, string][] = [
  [/^(\d[\d,]*)\s+buffs?$/i, "$1 项增强"], [/^(\d[\d,]*)\s+nerfs?$/i, "$1 项削弱"],
  [/^(\d[\d,]*)\s+other changes$/i, "$1 项其他改动"], [/^(\d[\d,]*)\s+talent tree changes$/i, "$1 项天赋树改动"],
  [/^(\d[\d,]*)\s+new items$/i, "$1 件新物品"], [/^(\d[\d,]*)\s+changed items$/i, "$1 件改动物品"],
  [/^Build\s+([\d.]+)$/i, "版本 $1"], [/^(\d[\d,]*)\s+votes$/i, "$1 票"],
  [/^Lv(\d+)\s+cap.*?(\d+)\s+specs$/i, "等级上限 $1 · $2 个专精"],
  [/(\d[\d,]*)\s+pages/gi, "$1 页面"], [/(\d[\d,]*)\s+items/gi, "$1 物品"], [/(\d[\d,]*)\s+spells/gi, "$1 法术"], [/(\d[\d,]*)\s+sets/gi, "$1 套装"],
  [/(\d[\d,]*)\s+votes/gi, "$1 票"],
  [/new dungeons/gi, "个新副本"], [/from Classic/gi, "个经典副本"], [/recorded bosses/gi, "个已记录首领"],
  [/\bpages\b/gi, "页面"], [/\bitems\b/gi, "物品"], [/\bspells\b/gi, "法术"], [/\bsets\b/gi, "套装"],
  [/TANK/gi, "坦克"], [/HEALER/gi, "治疗"],
  [/^Search ([\d,+]+) entries.*$/i, "搜索 $1+ 条目"],
];

function translate(raw: string, names: Record<string, string>): string {
  const text = raw.trim();
  if (!text) return raw;
  const lower = text.toLowerCase();
  const exactKey = Object.keys(exact).find((key) => key.toLowerCase() === lower);
  if (exactKey) return raw.replace(text, exact[exactKey]);
  const nameKey = Object.keys(names).find((key) => key.toLowerCase() === lower);
  if (nameKey) return raw.replace(text, names[nameKey]);
  let phraseOut = text;
  for (const [re, out] of phrase) phraseOut = phraseOut.replace(re, out);
  if (phraseOut !== text) return raw.replace(text, phraseOut);
  let out = text;
  const keys = Object.keys(names).sort((a, b) => b.length - a.length);
  for (const key of keys.slice(0, 4000)) {
    if (key.length >= 4 && out.includes(key)) out = out.split(key).join(names[key]);
  }
  return out === text ? raw : raw.replace(text, out);
}

async function translateApi(texts: string[]): Promise<Record<string, string>> {
  try {
    const response = await fetch("/api/zh-translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texts }) });
    const data = (await response.json()) as { translations?: string[] };
    return Object.fromEntries(texts.map((text, i) => [text, data.translations?.[i] || text]));
  } catch { return Object.fromEntries(texts.map((text) => [text, text])); }
}

const SKIP = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA"]);

export function ZhTranslate() {
  const pathname = usePathname();
  useEffect(() => {
    if (!(pathname === "/zh" || pathname.startsWith("/zh/"))) return;
    let names: Record<string, string> = {};
    let active = true;
    let apiTimer: number | undefined;
    let apiRunning = false;
    const apiCache = new Map<string, string>();
    const original = new Map<Text, string>();
    const run = () => {
      if (!active) return;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || SKIP.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (!/[A-Za-z]/.test(node.nodeValue ?? "")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const current = node.nodeValue ?? "";
        const translated = translate(current, names);
        if (translated !== current) {
          if (!original.has(node)) original.set(node, current);
          node.nodeValue = translated;
        }
      }
      document.querySelectorAll("input[placeholder]").forEach((input) => {
        const el = input as HTMLInputElement; const p = el.placeholder; const t = translate(p, names); if (t !== p) el.placeholder = t;
      });
    };
    const translateTitle = async () => {
      const title = document.title;
      if (!title || /[\u4e00-\u9fff]/.test(title)) return;
      const result = await translateApi([title]);
      if (active && result[title] && result[title] !== title) document.title = result[title];
    };
    fetch("/zh-names.json").then((r) => r.json()).then((data) => { if (active) { names = data; run(); void translateRemaining(); void translateTitle(); } }).catch(() => { run(); void translateRemaining(); void translateTitle(); });
    run();

    async function translateRemaining() {
      if (apiRunning) return;
      apiRunning = true;
      const candidates = new Map<string, Text[]>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || SKIP.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          const value = (node.nodeValue ?? "").trim();
          if (value.length < 2 || !/[A-Za-z]/.test(value)) return NodeFilter.FILTER_REJECT;
          const englishWords = value.match(/[A-Za-z][A-Za-z'’-]+/g)?.length ?? 0;
          const chineseChars = value.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
          if (englishWords < 2 && chineseChars > 0) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const value = (node.nodeValue ?? "").trim();
        if (!candidates.has(value)) candidates.set(value, []);
        candidates.get(value)!.push(node);
      }
      const values = [...candidates.keys()].filter((value) => !apiCache.has(value)).slice(0, 160);
      for (let i = 0; i < values.length; i += 12) {
        const batch = values.slice(i, i + 12);
        const fresh = batch.filter((value) => !apiCache.has(value));
        if (fresh.length === 0) continue;
        const result = await translateApi(fresh);
        for (const value of fresh) apiCache.set(value, result[value] ?? value);
        if (!active) return;
        for (const text of batch) {
          const translated = result[text];
          if (!translated || translated === text) continue;
          for (const target of candidates.get(text) ?? []) {
            if (!target.isConnected) continue;
            if (!original.has(target)) original.set(target, target.nodeValue ?? "");
            target.nodeValue = translated;
          }
        }
      }
      apiRunning = false;
    }

    const scheduleApi = () => {
      window.clearTimeout(apiTimer);
      apiTimer = window.setTimeout(() => { void translateRemaining(); }, 600);
    };
    const delayed = window.setTimeout(() => { void translateRemaining(); }, 2500);
    const obs = new MutationObserver(() => { run(); scheduleApi(); });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      active = false;
      obs.disconnect();
      window.clearTimeout(delayed);
      window.clearTimeout(apiTimer);
      for (const [node, value] of original) if (node.isConnected) node.nodeValue = value;
      original.clear();
    };
  }, [pathname]);
  return null;
}
