#!/usr/bin/env python3
import json, re, time, urllib.parse, urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "src/data/forever/guides.en.json"
data = json.load(open(PATH))

def translate(text):
    url = "https://clients5.google.com/translate_a/t?" + urllib.parse.urlencode({
        "client": "dict-chrome-ex", "sl": "zh-CN", "tl": "en", "q": text,
    })
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                out = json.load(r)
            return out[0] if isinstance(out, list) and out else text
        except Exception:
            time.sleep(2 + attempt * 2)
    return text

for guide in data:
    if not re.search(r"[\u4e00-\u9fff]", guide["html"]):
        continue
    soup = BeautifulSoup(guide["html"], "html.parser")
    nodes = [n for n in soup.find_all(string=True) if re.search(r"[\u4e00-\u9fff]", n)]
    for start in range(0, len(nodes), 8):
        batch = nodes[start:start+8]
        joined = "\nZXSEP0000\n".join(str(n).strip() for n in batch)
        translated = translate(joined)
        parts = translated.split("ZXSEP0000")
        if len(parts) != len(batch):
            parts = [translate(str(n).strip()) for n in batch]
        for node, text in zip(batch, parts):
            node.replace_with(text.strip())
        time.sleep(0.4)
    guide["html"] = str(soup)
    # translate image alt text too
    soup2 = BeautifulSoup(guide["html"], "html.parser")
    for img in soup2.find_all("img"):
        alt = img.get("alt")
        if alt and re.search(r"[\u4e00-\u9fff]", alt):
            img["alt"] = translate(alt)
    guide["html"] = str(soup2)
    print("translated", guide["slug"])

PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
