"use client";

import { usePathname } from "next/navigation";

type Art = { route: string; src: string; pos?: string };
const arts: Art[] = [
  { route: "/dungeons", src: "/dungeons/fc/maps/hall-of-thanes.webp", pos: "center 38%" },
  { route: "/map", src: "/dungeons/fc/maps/blackrock-depths.jpg", pos: "center 42%" },
  { route: "/items", src: "/patch-notes/wcl-hero.webp", pos: "78% 38%" },
  { route: "/search", src: "/dungeons/fc/maps/uldaman.jpg", pos: "center 42%" },
  { route: "/bis", src: "/legacy/bg/0.jpg", pos: "center 32%" },
  { route: "/professions", src: "/legacy/bg/1.jpg", pos: "center 35%" },
  { route: "/transmog", src: "/legacy/bg/2.jpg", pos: "center 36%" },
  { route: "/tools", src: "/dungeons/fc/maps/wailing-caverns.webp", pos: "center 40%" },
  { route: "/guides", src: "/dungeons/fc/maps/maraudon.jpg", pos: "center 40%" },
  { route: "/classes", src: "/dungeons/fc/maps/blackfathom-deeps.jpg", pos: "center 40%" },
  { route: "/quests", src: "/dungeons/fc/maps/zulfarrak.jpg", pos: "center 40%" },
  { route: "/npcs", src: "/dungeons/fc/maps/razorfen-downs.jpg", pos: "center 38%" },
  { route: "/spells", src: "/dungeons/fc/maps/scarlet-monastery-library.webp", pos: "center 38%" },
  { route: "/races", src: "/dungeons/fc/maps/ruins-of-lordaeron.webp", pos: "center 40%" },
  { route: "/data", src: "/dungeons/fc/maps/blackrock-spire-a.jpg", pos: "center 38%" },
  { route: "/database", src: "/dungeons/fc/maps/stratholme-main-gate.jpg", pos: "center 38%" },
  { route: "/class-finder", src: "/dungeons/fc/maps/blackrock-spire-b.jpg", pos: "center 40%" },
  { route: "/server-status", src: "/dungeons/fc/maps/the-stockade.webp", pos: "center 38%" },
  { route: "/about", src: "/dungeons/fc/maps/maraudon-b.jpg", pos: "center 42%" },
  { route: "/contact", src: "/dungeons/fc/maps/blackrock-spire-c.jpg", pos: "center 40%" },
];

export function PageArt() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return null;
  if (pathname === "/" || pathname === "/patch-notes") return null;
  const art = arts.find((entry) => entry.route === pathname);
  if (!art) return null;
  return (
    <div aria-hidden="true" className="page-art pointer-events-none absolute inset-x-0 top-0 h-[24rem] overflow-hidden">
      <img src={art.src} alt="" className="absolute right-0 top-0 h-full w-[64%] object-cover opacity-[0.52] saturate-[0.9] brightness-[1.3]" style={{ objectPosition: art.pos }} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-abyss/95" />
    </div>
  );
}
