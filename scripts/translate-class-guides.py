#!/usr/bin/env python3
import json, re, time, urllib.parse, urllib.request, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src/data/class-guides.json"
OUT = ROOT / "src/data/class-guides.en.json"
TALENTS = ROOT / "src/data/forever/talents.json"
SPELLS = ROOT / "src/data/scarlet/spellbooks.json"
RACIALS = ROOT / "src/data/scarlet/racials.json"
CLASS_RACIAL = ROOT / "src/data/scarlet/class_racial.json"

glossary = {}

def add(zh, en):
    if zh and en:
        glossary.setdefault(str(zh).strip(), str(en).strip())

def walk(value):
    if isinstance(value, dict):
        zh = value.get("nameCn") or value.get("abilityNameCn") or value.get("name")
        en = value.get("name") or value.get("abilityName")
        if zh and en and zh != en and re.search(r"[\u4e00-\u9fff]", str(zh)):
            add(zh, en)
        for v in value.values():
            walk(v)
    elif isinstance(value, list):
        for v in value:
            walk(v)

for f in (SPELLS, RACIALS, CLASS_RACIAL):
    walk(json.load(open(f)))
for c in json.load(open(TALENTS)):
    for tree in c.get("trees", []):
        for t in tree.get("talents", []):
            add(t.get("name"), t.get("nameEn"))

for zh, en in {
    "天裔": "Skyborne",
    "塑风者天裔": "Skyborne (Windshaper)",
    "高阶会天裔": "Skyborne (High Order)",
    "联盟": "Alliance",
    "部落": "Horde",
}.items():
    add(zh, en)

SECTION_TITLES = {
    "sec-overview": "Overview",
    "sec-changes": "What changed",
    "sec-proscons": "Pros & cons",
    "sec-races": "Races",
    "sec-professions": "Professions",
    "sec-rotation": "Rotation",
}

def translate(text):
    url = "https://clients5.google.com/translate_a/t?" + urllib.parse.urlencode({
        "client": "dict-chrome-ex",
        "sl": "zh-CN",
        "tl": "en",
        "q": text,
    })
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                data = json.load(r)
            if isinstance(data, list) and data:
                return data[0] if isinstance(data[0], str) else "".join(data)
        except Exception as exc:
            print(f"retry {attempt+1}: {exc}", file=sys.stderr)
        time.sleep(2 + attempt * 3)
    raise RuntimeError("translation failed")

def tokenize(markdown):
    tokens = {}
    def repl(match):
        name = match.group(1).strip()
        en = glossary.get(name)
        if not en:
            return match.group(0)
        token = f"ZXQSKILL{len(tokens):04d}"
        tokens[token] = en
        return token
    protected = re.sub(r"【([^】]{1,40})】", repl, markdown)
    return protected, tokens

def restore(text, tokens):
    for token, en in tokens.items():
        text = text.replace(token, f"【{en}】")
    return text

def main():
    source = json.load(open(SRC))
    out = []
    for i, guide in enumerate(source, 1):
        print(f"[{i}/{len(source)}] {guide['specId']} {guide['specName']}", file=sys.stderr)
        sections = []
        for section in guide["sections"]:
            protected, tokens = tokenize(section["markdown"])
            english = translate(protected)
            sections.append({
                "key": section["key"],
                "title": SECTION_TITLES.get(section["key"], section["title"]),
                "markdown": restore(english, tokens),
            })
            time.sleep(0.5)
        out.append({
            "specId": guide["specId"],
            "specName": guide["specName"],
            "title": guide["title"].replace("概述攻略", "Guide"),
            "updatedAt": guide["updatedAt"],
            "sections": sections,
        })
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {OUT}", file=sys.stderr)

if __name__ == "__main__":
    main()
