import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PvP guides — planned",
  description:
    "PvP guides for World of Warcraft: Forever: battleground roles, world PvP, and class matchups. Planned for after launch.",
  alternates: { canonical: "/guides/pvp", languages: { en: "/guides/pvp", "zh-Hans": "/zh/guides/pvp", "x-default": "/guides/pvp" } },
};

export default function PvpGuidesPage() {
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/guides" className="hover:text-gold-soft">
          Guides
        </Link>{" "}
        / <span className="text-parchment/80">PvP</span>
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="badge">Planned</span>
            <span className="text-muted">PvP</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            PvP guides
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            Battleground roles, world PvP, and class matchups — written after we
            have live battleground data, not from beta clips.
          </p>

          <div className="gold-rule my-8" />

          <h2 className="display text-xl text-parchment">What we will cover</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li>• Battleground objectives and the roles each class actually fills.</li>
            <li>• World PvP: escape routes, layer etiquette, and when to disengage.</li>
            <li>• Class matchups and the cooldown trades that decide fights.</li>
            <li>• Honor and reputation rewards, once the reward tables are confirmed.</li>
          </ul>

          <div className="panel mt-8 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Why this is not live</p>
            <p className="mt-1">
              PvP advice ages badly. The first week of a fresh ruleset produces
              new meta every day; publishing now would be guessing. The{" "}
              <Link href="/guides/start-here-rulesets-and-realms" className="text-gold/90 hover:text-gold-soft">
                ruleset guide
              </Link>{" "}
              explains the PvP-versus-PvE decision in the meantime.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/guides"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              All guides
            </Link>
            <Link
              href="/guides/professions"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Profession guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
