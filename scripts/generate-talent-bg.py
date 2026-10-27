import colorsys, math, os, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 700, 1000

SPEC = {
    # class: (spec names in tree order, themes, colors)
    "Warrior": (["Arms", "Fury", "Protection"], ["steel", "fire", "shield"], ["#C79C6E", "#FF5A3C", "#6F8FB5"]),
    "Paladin": (["Holy", "Protection", "Retribution"], ["light", "shield", "fire"], ["#FFD77A", "#9FB6D8", "#FF9D4D"]),
    "Hunter": (["Beast Mastery", "Marksmanship", "Survival"], ["jungle", "forest", "wild"], ["#6FAE5A", "#9A8A5A", "#8FAE5A"]),
    "Rogue": (["Assassination", "Combat", "Subtlety"], ["poison", "steel", "shadow"], ["#7AC07A", "#C9C2A3", "#8A6FBF"]),
    "Priest": (["Discipline", "Holy", "Shadow Magic"], ["light", "light", "shadow"], ["#E8D9FF", "#FFE9A8", "#6B4FA0"]),
    "Shaman": (["Elemental Combat", "Enhancement", "Restoration"], ["storm", "storm", "water"], ["#4FA8FF", "#7FD0FF", "#4FD0C0"]),
    "Mage": (["Arcane", "Fire", "Frost"], ["library", "volcano", "ice"], ["#8F7FFF", "#FF6A3A", "#7FD8FF"]),
    "Warlock": (["Affliction", "Demonology", "Destruction"], ["plague", "fel", "fire"], ["#79A05A", "#7FE05A", "#FF4A3A"]),
    "Druid": (["Balance", "Feral Combat", "Restoration"], ["moon", "jungle", "nature"], ["#B8C7FF", "#7FAE5A", "#5FCF8F"]),
}
CLASS_IDS = {"Warrior": 1, "Paladin": 2, "Hunter": 3, "Rogue": 4, "Priest": 5,
             "Shaman": 7, "Mage": 8, "Warlock": 9, "Druid": 11}

def rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def shift(c, deg):
    r, g, b = [v / 255 for v in c]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h = (h + deg / 360) % 1
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return tuple(int(v * 255) for v in (r, g, b))

def poly(d, pts, fill): d.polygon(pts, fill=fill)

def motif(theme, d, c, rnd):
    col = c + (42,)
    dim = tuple(int(v * 0.55) for v in c) + (60,)

    if theme in ("fire", "volcano", "fel"):
        base_y = H
        for i in range(8):
            x = rnd.randint(0, W); w = rnd.randint(60, 160); h = rnd.randint(120, 340)
            poly(d, [(x, base_y), (x + w, base_y), (x + w * 0.55, base_y - h), (x + w * 0.2, base_y - h * 0.45)], col)
        if theme == "volcano":
            poly(d, [(0, H), (0, 620), (180, 430), (330, 560), (520, 380), (700, 600), (700, H)], dim)
            for i in range(30):
                x, y = rnd.randint(0, W), rnd.randint(380, 700)
                d.ellipse([x, y, x + 3, y + 3], fill=shift(c, 10) + (70,))
    elif theme == "ice":
        for i in range(9):
            x = rnd.randint(0, W); h = rnd.randint(120, 320); w = rnd.randint(40, 110)
            poly(d, [(x, H), (x + w, H), (x + w * 0.5, H - h)], shift(c, rnd.choice([-10, 0, 12])) + (46,))
        for i in range(4):
            y = rnd.randint(80, 360)
            d.arc([-100, y, W + 100, y + 180], 200, 340, fill=shift(c, 0) + (26,), width=2)
    elif theme in ("jungle", "wild", "nature", "forest"):
        trunk = (18, 34, 20, 90) if theme != "forest" else (44, 34, 20, 95)
        for i in range(5):
            x = rnd.randint(0, W); w = rnd.randint(18, 42)
            poly(d, [(x, H), (x + w, H), (x + w * 0.8, H * 0.35), (x + w * 0.2, H * 0.35)], trunk)
        for i in range(16):
            x, y = rnd.randint(-40, W + 40), rnd.randint(40, int(H * 0.65))
            rx, ry = rnd.randint(50, 150), rnd.randint(30, 90)
            d.ellipse([x, y, x + rx, y + ry], fill=tuple(int(v * 0.7) for v in c) + (28,))
        if theme == "forest":
            for i in range(5):
                x, y = rnd.randint(0, 300), rnd.randint(500, 820)
                x2, y2 = x + rnd.randint(260, 420), y - rnd.randint(60, 160)
                d.line([(x, y), (x2, y2)], fill=(190, 180, 140, 70), width=2)
                poly(d, [(x2, y2), (x2 - 14, y2 - 5), (x2 - 4, y2 + 9)], (190, 180, 140, 70))
    elif theme == "library":
        for i in range(5):
            x = 40 + i * 120; y = rnd.randint(420, 560)
            d.rectangle([x, y, x + 96, H], fill=(28, 22, 46, 120))
            for b in range(4):
                bx = x + 8 + (b % 2) * 44
                by = y + 16 + (b // 2) * 60
                d.rectangle([bx, by, bx + 32, by + 48], fill=(60, 44, 90, 90))
        for i in range(7):
            x, y = rnd.randint(80, W - 80), rnd.randint(140, 520)
            r = rnd.randint(10, 26)
            d.ellipse([x, y, x + r, y + r], outline=shift(c, 10) + (55,), width=2)
    elif theme == "light":
        cx = W // 2
        for i in range(7):
            spread = 120 + i * 34
            poly(d, [(cx - 14, 0), (cx + 14, 0), (cx + spread, H), (cx - spread, H)], (255, 236, 190, 14))
        for i in range(5):
            y = 40 + i * 60
            d.ellipse([cx - 220, y, cx + 220, y + 20], outline=(255, 240, 200, 30), width=2)
    elif theme == "shadow":
        for i in range(6):
            y = rnd.randint(220, 760)
            d.arc([-160, y, W + 160, y + 260], 200, 340, fill=shift(c, 0) + (40,), width=3)
        for i in range(4):
            x, y = rnd.randint(100, W - 100), rnd.randint(180, 520)
            r = rnd.randint(30, 70)
            d.ellipse([x, y, x + r, y + r], fill=(20, 12, 34, 80))
    elif theme == "storm":
        for i in range(5):
            x, y = rnd.randint(0, W), rnd.randint(20, 180)
            d.ellipse([x, y, x + rnd.randint(160, 300), y + rnd.randint(60, 110)], fill=(18, 24, 42, 110))
        for i in range(3):
            x = rnd.randint(60, W - 60); y = rnd.randint(180, 300)
            pts = [(x, y)]
            for s in range(6):
                x += rnd.randint(-30, 34); y += rnd.randint(24, 46)
                pts.append((x, y))
            d.line(pts, fill=(200, 230, 255, 85), width=3)
    elif theme == "water":
        for i in range(6):
            y = 520 + i * 70
            d.arc([-200, y, W + 200, y + 160], 200, 340, fill=shift(c, 0) + (35,), width=2)
        for i in range(10):
            x, y = rnd.randint(0, W), rnd.randint(200, 700)
            r = rnd.randint(3, 7)
            d.ellipse([x, y, x + r, y + r], fill=(200, 240, 255, 50))
    elif theme in ("steel", "shield", "poison"):
        if theme == "shield":
            cx, cy, r = W // 2, 480, 210
            pts = [(cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))) for a in range(0, 360, 60)]
            d.polygon(pts, outline=(180, 200, 230, 70))
            d.polygon(pts, outline=(180, 200, 230, 45))
            for i in range(3):
                rr = r - 30 - i * 24
                pts = [(cx + rr * math.cos(math.radians(a)), cy + rr * math.sin(math.radians(a))) for a in range(0, 360, 60)]
                d.polygon(pts, outline=(180, 200, 230, 30))
        elif theme == "poison":
            for i in range(8):
                x, y = rnd.randint(0, W), rnd.randint(300, 760)
                r = rnd.randint(8, 22)
                d.ellipse([x, y, x + r, y + r], fill=shift(c, 6) + (70,))
        else:
            for i in range(4):
                x, y = rnd.randint(0, W), rnd.randint(200, 620)
                poly(d, [(x, y), (x + 300, y + 180), (x + 290, y + 200), (x - 8, y + 24)], (200, 205, 214, 34))
    elif theme == "moon":
        d.ellipse([W // 2 - 150, 90, W // 2 + 150, 390], fill=(220, 226, 255, 30))
        d.ellipse([W // 2 - 70, 120, W // 2 + 90, 260], fill=(12, 16, 32, 90))
        for i in range(40):
            x, y = rnd.randint(0, W), rnd.randint(0, 500)
            d.ellipse([x, y, x + 2, y + 2], fill=(230, 236, 255, 90))

def make(c, theme, seed, emblem=None):
    rnd = random.Random(seed)
    base = Image.new("RGB", (W, H), (5, 8, 15))
    d = ImageDraw.Draw(base)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(5 + 6*t), int(8 + 8*t), int(15 + 14*t)))

    for i in range(7):
        blob = Image.new("L", (W, H), 0)
        bd = ImageDraw.Draw(blob)
        r = rnd.randint(160, 320)
        cx, cy = rnd.randint(-80, W + 80), rnd.randint(-80, int(H * 0.55))
        bd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=rnd.randint(40, 85))
        blob = blob.filter(ImageFilter.GaussianBlur(130))
        base = Image.composite(Image.new("RGB", (W, H), shift(c, rnd.choice([-12, 0, 12]))), base, blob)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    motif(theme, ImageDraw.Draw(overlay), c, rnd)
    overlay = overlay.filter(ImageFilter.GaussianBlur(2))
    base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")

    if emblem and os.path.exists(emblem):
        icon = Image.open(emblem).convert("L").resize((420, 420), Image.LANCZOS)
        tinted = Image.new("RGB", icon.size, c)
        em = Image.composite(tinted, Image.new("RGB", icon.size, (0, 0, 0)), icon)
        em = em.filter(ImageFilter.GaussianBlur(7))
        mask = icon.point(lambda v: int(v * 0.10))
        base.paste(em, (W // 2 - 210, 60), mask)

    noise = Image.effect_noise((W, H), 20).convert("L")
    noise = noise.filter(ImageFilter.GaussianBlur(0.4))
    base = Image.composite(Image.new("RGB", (W, H), (120, 130, 150)), base, noise.point(lambda v: int(v * 0.06)))

    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([-W * 0.2, -H * 0.1, W * 1.2, H * 1.1], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(150))
    base = Image.composite(base, Image.new("RGB", (W, H), (2, 3, 6)), mask)
    return base

for cls, (names, themes, colors) in SPEC.items():
    cid = CLASS_IDS[cls]
    slug = cls.lower()
    for i, theme in enumerate(themes):
        color = rgb(colors[i])
        img = make(color, theme, seed=cid * 100 + i * 7,
                   emblem=f"scripts/classicons/classicon_{slug}.jpg")
        img.save(f"public/talents/bg/{cid}-{i}.jpg", quality=82, optimize=True)
print("generated", sum(len(v[2]) for v in SPEC.values()), "themed backgrounds")
