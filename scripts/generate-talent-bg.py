import colorsys, math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ACCENTS = {
    "Warrior": "#C79C6E", "Paladin": "#F58CBA", "Hunter": "#ABD473",
    "Rogue": "#FFF569", "Priest": "#FFFFFF", "Shaman": "#0070DE",
    "Mage": "#69CCF0", "Warlock": "#9482C9", "Druid": "#FF7D0A",
}
CLASS_IDS = {
    "Warrior": 1, "Paladin": 2, "Hunter": 3, "Rogue": 4, "Priest": 5,
    "Shaman": 7, "Mage": 8, "Warlock": 9, "Druid": 11,
}
SLUGS = {
    "Warrior": "warrior", "Paladin": "paladin", "Hunter": "hunter",
    "Rogue": "rogue", "Priest": "priest", "Shaman": "shaman",
    "Mage": "mage", "Warlock": "warlock", "Druid": "druid",
}

W, H = 700, 1000

def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def shift(rgb, deg):
    r, g, b = [c / 255 for c in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h = (h + deg / 360) % 1
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return tuple(int(c * 255) for c in (r, g, b))

def make(accent_rgb, tree_index, seed, emblem_path):
    rnd = random.Random(seed)
    base = Image.new("RGB", (W, H), (5, 8, 15))
    d = ImageDraw.Draw(base)
    # vertical gradient
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(5 + 8*t), int(8 + 10*t), int(15 + 18*t)))

    # glow blobs
    for i in range(10):
        blob = Image.new("L", (W, H), 0)
        bd = ImageDraw.Draw(blob)
        r = rnd.randint(140, 320)
        cx = rnd.randint(-100, W + 100)
        cy = rnd.randint(-120, H // 2 + 200)
        bd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=rnd.randint(35, 90))
        blob = blob.filter(ImageFilter.GaussianBlur(120))
        color = shift(accent_rgb, rnd.choice([-18, -8, 0, 10, 22]))
        layer = Image.new("RGB", (W, H), color)
        base = Image.composite(layer, base, blob)

    # faded class emblem behind the talent grid
    if os.path.exists(emblem_path):
        icon = Image.open(emblem_path).convert("L").resize((520, 520), Image.LANCZOS)
        size = icon.size
        tinted = Image.new("RGB", size, shift(accent_rgb, 0))
        emblem = Image.composite(tinted, Image.new("RGB", size, (0, 0, 0)), icon)
        emblem = emblem.filter(ImageFilter.GaussianBlur(8))
        mask = icon.point(lambda v: int(v * 0.18))
        base.paste(emblem, (W // 2 - 260, 70), mask)

    # angular shards
    shards = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd0 = ImageDraw.Draw(shards)
    for _ in range(9):
        x = rnd.randint(-100, W)
        y = rnd.randint(80, H - 120)
        pts = [(x, y), (x + rnd.randint(40, 160), y - rnd.randint(10, 70)),
               (x + rnd.randint(20, 90), y + rnd.randint(10, 40))]
        sd0.polygon(pts, fill=shift(accent_rgb, rnd.choice([-14, 0, 14])) + (rnd.randint(8, 18),))
    shards = shards.filter(ImageFilter.GaussianBlur(3))
    base = Image.alpha_composite(base.convert("RGBA"), shards).convert("RGB")

    # diagonal light streaks
    streaks = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(streaks)
    for i in range(6):
        x = rnd.randint(-200, W)
        sd.line([(x, -50), (x + rnd.randint(200, 500), H + 50)],
                fill=shift(accent_rgb, rnd.choice([-10, 0, 12])) + (rnd.randint(8, 22),),
                width=rnd.randint(1, 4))
    streaks = streaks.filter(ImageFilter.GaussianBlur(6))
    base = Image.alpha_composite(base.convert("RGBA"), streaks).convert("RGB")

    # faint rune rings
    runes = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(runes)
    cx, cy = W // 2, int(H * 0.28)
    for r in (110, 170, 240):
        rd.arc([cx - r, cy - r, cx + r, cy + r], 200, 340,
               fill=shift(accent_rgb, 0) + (18,), width=2)
    for a in range(0, 360, 45):
        x = cx + math.cos(math.radians(a)) * 240
        y = cy + math.sin(math.radians(a)) * 240
        rd.ellipse([x - 3, y - 3, x + 3, y + 3],
                   fill=shift(accent_rgb, 0) + (25,))
    runes = runes.filter(ImageFilter.GaussianBlur(1))
    base = Image.alpha_composite(base.convert("RGBA"), runes).convert("RGB")

    # grain
    noise = Image.effect_noise((W, H), 22).convert("L")
    noise = noise.filter(ImageFilter.GaussianBlur(0.4))
    base = Image.composite(Image.new("RGB", (W, H), (120, 130, 150)), base,
                           noise.point(lambda v: int(v * 0.07)))

    # vignette
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse([-W * 0.2, -H * 0.1, W * 1.2, H * 1.1], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(160))
    dark = Image.new("RGB", (W, H), (2, 3, 6))
    base = Image.composite(base, dark, mask)

    return base

for cls, accent in ACCENTS.items():
    rgb = hex_rgb(accent)
    cid = CLASS_IDS[cls]
    for tree in range(3):
        shift_deg = [0, 16, -30][tree]
        img = make(shift(rgb, shift_deg), tree, seed=cid * 10 + tree,
                   emblem_path=f"/tmp/classicons/classicon_{SLUGS[cls]}.jpg")
        out = f"public/talents/bg/{cid}-{tree}.jpg"
        img.save(out, quality=82, optimize=True)
print("generated", len(ACCENTS) * 3, "backgrounds")
