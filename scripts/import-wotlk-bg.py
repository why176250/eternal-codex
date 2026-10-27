"""Fetch the classic spec background art used by Wowhead's WotLK calculator.

Source: wow.zamimg.com/images/wow/talents/backgrounds/wrath/<id>.jpg
Artwork is © Blizzard Entertainment; used here for a non-commercial fan site.
"""
import subprocess
from PIL import Image, ImageOps

CLASS_IDS = {"warrior":1,"paladin":2,"hunter":3,"rogue":4,"priest":5,
             "shaman":7,"mage":8,"warlock":9,"druid":11}
IDS = {
 "warrior":[161,164,163], "paladin":[382,383,381], "hunter":[361,363,362],
 "rogue":[182,181,183], "priest":[201,202,203], "shaman":[261,263,262],
 "mage":[81,41,61], "warlock":[302,303,301], "druid":[283,281,282],
}

for cls, arr in IDS.items():
    for i, bid in enumerate(arr):
        src = f"/tmp/wh/{cls}-{i}.jpg"
        subprocess.run(["curl","-sL","-x","http://127.0.0.1:7890","--max-time","30",
                        "-o",src,f"https://wow.zamimg.com/images/wow/talents/backgrounds/wrath/{bid}.jpg"],
                       check=False)
        im = Image.open(src).convert("RGB")
        im = ImageOps.fit(im, (700, 1000), method=Image.LANCZOS, centering=(0.5, 0.42))
        im.save(f"public/talents/bg/{CLASS_IDS[cls]}-{i}.jpg", quality=88, optimize=True)
print("imported 27 spec backgrounds")
