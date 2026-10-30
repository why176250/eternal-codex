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
};

const phrase: [RegExp, string][] = [
  [/^(\d[\d,]*)\s+buffs?$/i, "$1 项增强"], [/^(\d[\d,]*)\s+nerfs?$/i, "$1 项削弱"],
  [/^(\d[\d,]*)\s+other changes$/i, "$1 项其他改动"], [/^(\d[\d,]*)\s+talent tree changes$/i, "$1 项天赋树改动"],
  [/^(\d[\d,]*)\s+new items$/i, "$1 件新物品"], [/^(\d[\d,]*)\s+changed items$/i, "$1 件改动物品"],
  [/^Build\s+([\d.]+)$/i, "版本 $1"], [/^(\d[\d,]*)\s+votes$/i, "$1 票"],
  [/^Lv(\d+)\s+cap.*?(\d+)\s+specs$/i, "等级上限 $1 · $2 个专精"],
  [/(\d[\d,]*)\s+pages/gi, "$1 页面"], [/(\d[\d,]*)\s+items/gi, "$1 物品"], [/(\d[\d,]*)\s+spells/gi, "$1 法术"], [/(\d[\d,]*)\s+sets/gi, "$1 套装"],
  [/(\d[\d,]*)\s+votes/gi, "$1 票"],
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

const SKIP = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA"]);

export function ZhTranslate() {
  const pathname = usePathname();
  useEffect(() => {
    if (!(pathname === "/zh" || pathname.startsWith("/zh/"))) return;
    let names: Record<string, string> = {};
    let active = true;
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
        const translated = translate(node.nodeValue ?? "", names);
        if (translated !== node.nodeValue) node.nodeValue = translated;
      }
      document.querySelectorAll("input[placeholder]").forEach((input) => {
        const el = input as HTMLInputElement; const p = el.placeholder; const t = translate(p, names); if (t !== p) el.placeholder = t;
      });
    };
    fetch("/zh-names.json").then((r) => r.json()).then((data) => { if (active) { names = data; run(); } }).catch(() => run());
    run();
    const obs = new MutationObserver(() => { run(); });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { active = false; obs.disconnect(); };
  }, [pathname]);
  return null;
}
