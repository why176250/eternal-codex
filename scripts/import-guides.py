import json, html, re

SRC = "data-import/guides.json"
OUT = "src/data/forever/guides.json"

def esc(s):
    return html.escape(str(s or ""))

def render_table(table):
    if not table: return ""
    headers = table.get("headers", [])
    rows = table.get("rows", [])
    out = ['<table><thead><tr>'] + [f"<th>{esc(h)}</th>" for h in headers] + ['</tr></thead><tbody>']
    for row in rows:
        out.append("<tr>")
        for cell in row:
            text = cell.get("text") if isinstance(cell, dict) else cell
            out.append(f"<td>{esc(text)}</td>")
        out.append("</tr>")
    out.append("</tbody></table>")
    return "".join(out)

def render_items(items):
    out = []
    for it in items or []:
        name = it.get("name") or (it.get("item") or {}).get("name")
        text = it.get("text") or ""
        if name:
            out.append(f"<p><strong>{esc(name)}</strong>{(' — ' + esc(text)) if text else ''}</p>")
    return "".join(out)

def render_section(s):
    t = s.get("type")
    if t in ("intro", "paragraph"):
        return f"<p>{esc(s.get('content'))}</p>"
    if t == "section":
        return f"<h2>{esc(s.get('title'))}</h2>"
    if t == "tip":
        return f"<blockquote><p>{esc(s.get('content'))}</p></blockquote>"
    if t == "facts":
        out = ["<dl>"]
        for f in s.get("facts", []):
            out.append(f"<dt>{esc(f.get('term'))}</dt><dd>{esc(f.get('definition'))}</dd>")
        out.append("</dl>")
        return "".join(out)
    if t == "table":
        return render_table(s.get("table"))
    if t == "item_list":
        return render_items(s.get("items"))
    if t == "item_card":
        return ""
    if t == "image":
        src = s.get("src") or ""
        if src.startswith("/"):
            src = "https://www.sargerastech.com" + src
        return f'<p><img src="{esc(src)}" alt="{esc(s.get("alt"))}" loading="lazy" /></p>' if src else ""
    if t == "looks":
        out = ["<ul>"]
        for group in s.get("groups", []):
            for form in group.get("forms", []):
                colors = "、".join(l.get("color", "") for l in form.get("looks", []) if l.get("color"))
                out.append(f"<li>{esc(group.get('race'))} · {esc(form.get('name'))}（{esc(form.get('level'))}）：{esc(colors)}</li>")
        out.append("</ul>")
        return "".join(out)
    if t == "pvp_tldr":
        return "<dl>" + "".join(f"<dt>{esc(e.get('term'))}</dt><dd>{esc(e.get('def'))}</dd>" for e in s.get("entries", [])) + "</dl>"
    if t == "pvp_ranks":
        rows = ["<table><thead><tr><th>军衔</th><th>联盟</th><th>部落</th><th>点数</th><th>累计</th><th>最早</th></tr></thead><tbody>"]
        for r in s.get("rows", []):
            rows.append(f"<tr><td>{esc(r.get('n'))}</td><td>{esc(r.get('titleA'))}</td><td>{esc(r.get('titleH'))}</td><td>{esc(r.get('points'))}</td><td>{esc(r.get('total'))}</td><td>{esc(r.get('from'))}</td></tr>")
        rows.append("</tbody></table>")
        return "".join(rows)
    if t == "pvp_caps":
        rows = ["<table><thead><tr><th>周</th><th>军衔上限</th><th>累计</th><th>增量</th></tr></thead><tbody>"]
        for c in s.get("cards", []):
            rows.append(f"<tr><td>{esc(c.get('week'))}</td><td>{esc(c.get('rank'))}</td><td>{esc(c.get('total'))}</td><td>{esc(c.get('delta'))}</td></tr>")
        rows.append("</tbody></table>")
        return "".join(rows)
    if t == "pvp_seals":
        rows = ["<table><thead><tr><th>部位</th><th>开放军衔</th></tr></thead><tbody>"]
        for e in s.get("entries", []):
            rows.append(f"<tr><td>{esc(e.get('slot'))}</td><td>{esc(e.get('rank'))}</td></tr>")
        rows.append("</tbody></table>")
        return "".join(rows)
    if t == "pvp_sets":
        rows = ["<table><thead><tr><th>职业</th><th>专精</th><th>蓝色套装</th><th>史诗套装</th></tr></thead><tbody>"]
        for r in s.get("rows", []):
            blue = (r.get("blue") or {}).get("a", {}).get("name", "")
            epic = (r.get("epic") or {}).get("a", {}).get("name", "")
            rows.append(f"<tr><td>{esc(r.get('cls'))}</td><td>{esc(r.get('spec'))}</td><td>{esc(blue)}</td><td>{esc(epic)}</td></tr>")
        rows.append("</tbody></table>")
        return "".join(rows)
    if t == "pvp_legacy":
        return "<ul>" + "".join(f"<li>{esc(r.get('text'))}</li>" for r in s.get("rows", [])) + "</ul>"
    if t == "pvp_rep":
        out = []
        for group in s.get("groups", []):
            out.append(f"<h3>{esc(group.get('standing'))}</h3><ul>")
            for side in ("a", "h"):
                for it in group.get(side, []):
                    out.append(f"<li>{esc(it.get('name'))}</li>")
            out.append("</ul>")
        return "".join(out)
    # generic fallback: collect text fields
    texts = []
    def walk(v):
        if isinstance(v, str):
            if len(v) > 3 and not v.startswith("http") and not re.match(r"^[a-z0-9_]+$", v):
                texts.append(v)
        elif isinstance(v, list):
            for x in v: walk(x)
        elif isinstance(v, dict):
            for k, x in v.items():
                if k in ("icon", "iconA", "iconH", "img", "src", "color", "class_id", "id", "spell", "sid"):
                    continue
                walk(x)
    walk(s)
    return "".join(f"<p>{esc(x)}</p>" for x in texts[:12])

guides = json.load(open(SRC, encoding="utf-8"))
out = []
for g in guides:
    d = g["detail"]["guide"]
    sections = [render_section(s) for s in d.get("sections", [])]
    body = "".join(sections)
    out.append({
        "slug": d.get("slug") or g["slug"],
        "title": d.get("title") or g.get("title", ""),
        "titleEn": d.get("title_en") or g.get("titleEn", ""),
        "subtitle": d.get("subtitle", ""),
        "description": d.get("description", ""),
        "category": d.get("category", ""),
        "icon": d.get("icon", ""),
        "color": d.get("color", "#e3bd78"),
        "html": body,
    })

json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
import os
print(len(out), "guides", os.path.getsize(OUT)//1024, "KB")
print([ (o["slug"], len(o["html"])) for o in out ])
