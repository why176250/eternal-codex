"use client";

import { usePathname } from "next/navigation";

const arts: { route: string; src: string; pos?: string }[] = [
  { route: "/dungeons", src: "/page-art/classic-small/ClassicDungeon_4k.webp", pos: "center 45%" },
  { route: "/map", src: "/page-art/classic-small/ClassicLaunch_WoW_STV_3840x2160.webp", pos: "center 50%" },
  { route: "/items", src: "/page-art/classic-small/ClassicStormwind_4k.webp", pos: "center 42%" },
  { route: "/search", src: "/page-art/classic-small/ClassicOrgrimmar_4k.webp", pos: "center 42%" },
  { route: "/bis", src: "/page-art/classic-small/ClassicLaunch_WoW_Onyxia_3840x2160.webp", pos: "center 45%" },
  { route: "/professions", src: "/patch-notes/wcl-hero.webp", pos: "center 42%" },
  { route: "/transmog", src: "/page-art/yunhai-zhong.webp", pos: "center 50%" },
  { route: "/tools", src: "/legacy/bg/1.jpg", pos: "center 35%" },
  { route: "/tools/build", src: "/legacy/bg/0.jpg", pos: "center 35%" },
  { route: "/tools/xp", src: "/page-art/classic-small/ClassicLaunch_WoW_Andorhal_3840x2160.webp", pos: "center 45%" },
  { route: "/guides", src: "/legacy/bg/0.jpg", pos: "center 35%" },
  { route: "/classes", src: "/page-art/classic-small/WoW_Classic_Molten_Core_3840x2160.webp", pos: "center 45%" },
  { route: "/quests", src: "/page-art/classic-small/WoW_Classic_Westfall_3840x2160.webp", pos: "center 48%" },
  { route: "/npcs", src: "/page-art/classic-small/WoW_Classic_Barrens_3840x2160.webp", pos: "center 45%" },
  { route: "/spells", src: "/page-art/classic-small/ClassicDungeon_4k.webp", pos: "center 45%" },
  { route: "/races", src: "/page-art/classic-small/Onyxia_Key_Art.webp", pos: "center 40%" },
  { route: "/data", src: "/page-art/classic-small/ClassicLaunch_WoW_Andorhal_3840x2160.webp", pos: "center 45%" },
  { route: "/database", src: "/page-art/classic-small/Toast_Thumbnail_Options_TS03.webp", pos: "center 40%" },
  { route: "/class-finder", src: "/page-art/classic-small/WoW_ClassicLaunchPressKit_UngoroHunter_3840x2160.webp", pos: "center 45%" },
  { route: "/server-status", src: "/legacy/bg/2.jpg", pos: "center 35%" },
  { route: "/about", src: "/page-art/classic-small/WoW_ClassicLaunchPressKit_ThousandNeedles_3840x2160.webp", pos: "center 45%" },
  { route: "/contact", src: "/page-art/classic-small/WoW_ClassicLaunchPressKit_ScarletMonastery_3840x2160.webp", pos: "center 42%" },
];

export function PageArt() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/patch-notes") return null;
  const art = arts.find((entry) => entry.route === pathname);
  if (!art) return null;
  return (
    <div aria-hidden="true" className="page-art pointer-events-none absolute inset-x-0 top-0 h-[26rem] overflow-hidden">
      <img src={art.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.72] brightness-[1.04]" style={{ objectPosition: art.pos }} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/65 to-abyss/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/25 via-transparent to-abyss" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_100%_at_82%_0%,rgba(227,189,120,0.1),transparent_60%)]" />
    </div>
  );
}
