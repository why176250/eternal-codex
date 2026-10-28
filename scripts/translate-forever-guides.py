#!/usr/bin/env python3
import json, re, time, urllib.parse, urllib.request, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src/data/forever/guides.json"
OUT = ROOT / "src/data/forever/guides.en.json"
PUBLIC = ROOT / "public/guides/forever"

CATEGORY = {"职业": "Classes", "实用": "Systems", "收集": "Collecting", "PvP": "PvP"}

def translate(text):
    if not text.strip():
        return text
    url = "https://clients5.google.com/translate_a/t?" + urllib.parse.urlencode({
        "client": "dict-chrome-ex", "sl": "zh-CN", "tl": "en", "q": text,
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
    return text

def translate_html(html):
    tokens = {}
    def keep(match):
        token = f"ZXTAG{len(tokens):04d}"
        tokens[token] = match.group(0)
        return token
    protected = re.sub(r"<[^>]+>", keep, html)
    parts = []
    for i in range(0, len(protected), 4200):
        parts.append(translate(protected[i:i+4200]))
        time.sleep(0.7)
    result = " ".join(parts)
    for token, tag in tokens.items():
        result = result.replace(token, tag)
    return result

def download(url, slug):
    name = url.split("?")[0].rstrip("/").split("/")[-1]
    folder = PUBLIC / slug
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / name
    if not target.exists():
        try:
            data = urllib.request.urlopen(url, timeout=30).read()
            if len(data) > 500:
                target.write_bytes(data)
        except Exception as exc:
            print(f"image failed {url}: {exc}", file=sys.stderr)
            return url
    return f"/guides/forever/{slug}/{name}"

def main():
    guides = json.load(open(SRC))
    out = []
    for guide in guides:
        slug = guide["slug"]
        print(f"[{slug}]", file=sys.stderr)
        html = guide.get("html", "")
        for url in re.findall(r'<img[^>]+src="([^"]+)"', html):
            local = download(url, slug)
            html = html.replace(url, local)
        translated = translate_html(html)
        out.append({
            **guide,
            "title": guide.get("titleEn") or guide.get("title"),
            "subtitle": "World of Warcraft: Forever · Beta",
            "description": translate(guide.get("description", "")),
            "category": CATEGORY.get(guide.get("category", ""), guide.get("category", "Guide")),
            "html": translated,
        })
        time.sleep(1)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {OUT}", file=sys.stderr)

if __name__ == "__main__":
    main()
