import type { Metadata } from "next";
import Link from "next/link";
import { HunterPetsBrowser } from "@/components/HunterPetsBrowser";
import { petBeasts, petFamilies, petSkillEntryCount, petSkills } from "@/lib/hunter-pets";

export const metadata: Metadata = {
  title: "Hunter pets — families, beasts, and pet skills",
  description:
    "18 pet families, 502 tameable beasts, and 61 pet skills for World of Warcraft: Forever. Browse families, diets, modifiers, zones, and skill ranks.",
  alternates: { canonical: "/data/hunter-pets", languages: { en: "/data/hunter-pets", "zh-Hans": "/zh/data/hunter-pets", "x-default": "/data/hunter-pets" } },
};

export default function HunterPetsPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Data · Hunter pets</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Hunter pets
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Families, tameable beasts, and the skills each family brings. Check
            diet, damage/health/armor modifiers, zones, and pet-skill ranks before
            you tame.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-line/80 px-3 py-1">
              {petFamilies.length} families
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              {petBeasts.length} beasts
            </span>
            <span className="rounded-full border border-line/80 px-3 py-1">
              {petSkillEntryCount} skill entries
            </span>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-muted/70">
            Data source: Blue Hermit mini-program · personal, non-commercial
            reference. Verify pet levels and skills in game.
          </p>
        </div>
      </section>

      <section className="container-x py-8 md:py-10">
        <HunterPetsBrowser />
        <p className="mt-8 text-[11px] leading-relaxed text-muted/60">
          Pet family, beast, and skill data from the Blue Hermit mini-program.
          Names are shown as imported; personal, non-commercial use.
        </p>
        <Link
          href="/classes/hunter"
          className="mt-6 inline-block text-sm text-gold/90 hover:text-gold-soft"
        >
          ← Hunter class guide
        </Link>
      </section>
    </main>
  );
}
