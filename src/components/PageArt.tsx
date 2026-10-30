"use client";

import { usePathname } from "next/navigation";

const arts = [
  { match: ["/dungeons", "/map", "/items", "/search"], src: "/dungeons/fc/maps/hall-of-thanes.webp", pos: "center 42%" },
  { match: ["/guides", "/classes", "/quests", "/npcs"], src: "/patch-notes/wcl-hero.webp", pos: "center 40%" },
  { match: ["/bis", "/professions", "/transmog", "/tools"], src: "/legacy/bg/0.jpg", pos: "center 38%" },
];

export function PageArt() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/patch-notes" || pathname.startsWith("/patch-notes/")) return null;
  const art = arts.find((entry) => entry.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)));
  if (!art) return null;
  return (
    <div aria-hidden="true" className="page-art pointer-events-none absolute inset-x-0 top-0 h-[24rem] overflow-hidden">
      <img src={art.src} alt="" className="absolute right-0 top-0 h-full w-[64%] object-cover opacity-[0.52] saturate-[0.9] brightness-[1.3]" style={{ objectPosition: art.pos }} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-abyss/95" />
    </div>
  );
}
