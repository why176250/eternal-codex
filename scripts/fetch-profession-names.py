import json, re, time, urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

slugs = ["alchemy","blacksmithing","enchanting","engineering","leatherworking","tailoring","mining","herbalism","skinning","cooking","fishing","first-aid"]
names = {}
for slug in slugs:
    url = f"https://foreverchanges.pro/professions/{slug}"
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
    try:
        html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
    except Exception as exc:
        print("fetch failed", slug, exc); continue
    soup = BeautifulSoup(html, "html.parser")
    count = 0
    for a in soup.select('a[href^="/item/"]'):
        href = a.get("href", "")
        m = re.match(r"/item/(\d+)/([^?#]+)", href)
        if not m: continue
        item_id, text_slug = m.group(1), m.group(2).split("/")[-1]
        # Prefer visible name when the anchor actually contains a label.
        label = a.get_text(" ", strip=True)
        label = re.sub(r"\s+(New|Pattern|Recipe|Formula|Plans|Schematic)$", "", label).strip()
        if not label or label.isdigit() or label in {"Pattern","Recipe","Formula","Plans","Schematic"}:
            name = " ".join(w.capitalize() for w in text_slug.replace("_", "-").split("-"))
        else:
            name = label
        if item_id not in names and len(name) > 1:
            names[item_id] = name; count += 1
    print(slug, count, flush=True)
    time.sleep(1)
Path("src/data/item-names.en.json").write_text(json.dumps(names, ensure_ascii=False, indent=2) + "\n")
print("total", len(names))
