import type { Metadata } from "next";
import Link from "next/link";
import { dataItems } from "@/lib/sections";

const cardArt: Record<string, string> = {
  map: "/page-art/classic-small/ClassicLaunch_WoW_STV_3840x2160.webp",
  transmog: "/page-art/classic-small/ClassicStormwind_4k.webp",
  dungeons: "/page-art/classic-small/ClassicDungeon_4k.webp",
  items: "/page-art/classic-small/ClassicOrgrimmar_4k.webp",
  spells: "/page-art/yunhai-zhong.webp",
  races: "/page-art/classic-small/Onyxia_Key_Art.webp",
  quests: "/page-art/classic-small/WoW_Classic_Westfall_3840x2160.webp",
  professions: "/page-art/tielu-dadian.webp",
  sets: "/page-art/classic-small/ClassicLaunch_WoW_Onyxia_3840x2160.webp",
  abilities: "/page-art/classic-small/WoW_Classic_Molten_Core_3840x2160.webp",
  racials: "/page-art/classic-small/WoW_Classic_Barrens_3840x2160.webp",
  vendors: "/page-art/classic-small/WoW_ClassicLaunchPressKit_ThousandNeedles_3840x2160.webp",
  "patch-notes": "/patch-notes/wcl-hero.webp",
  "server-status": "/legacy/bg/2.jpg",
  "hunter-pets": "/page-art/classic-small/WoW_ClassicLaunchPressKit_UngoroHunter_3840x2160.webp",
};

export const metadata: Metadata = {
  title: "Data — dungeons, items, sets, abilities, racials, vendors, pets",
  description:
    "Reference data for World of Warcraft: Forever: dungeon and raid bands, item database, sets, class abilities, racials, vendor favor, and hunter pets.",
  alternates: { canonical: "/data" },
};

export default function DataPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <div className="flex items-center gap-3"><p className="eyebrow">Data</p><span className="badge badge-teal">15 datasets live</span></div>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            The reference layer
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Every dataset the site carries, grouped by what it answers. The Forever
            data set comes from official game data and Wowhead as a scaffold;
            English names are being filled in and pages without a verified
            English name are marked <span className="badge">EN pending</span>.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataItems.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="panel panel-hover group relative flex min-h-[184px] flex-col overflow-hidden p-5"
              >
                <img src={cardArt[item.slug]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 brightness-105 saturate-[0.9] transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/80 to-abyss/25" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-end">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted/60">{item.status === "live" ? "Available" : "Planned"}</span>
                  </div>
                  <h2 className="display mt-4 text-lg text-parchment">
                    {item.label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                  <span className="mt-auto pt-4 text-xs text-gold/80">
                    {item.status === "live" ? "Browse →" : "What's planned →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">How we fill these in</p>
            <p className="mt-1">
              Datasets go live only when the values can be checked in the live
              game or an official build. Until then the page explains what will
              be included instead of showing placeholder numbers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
