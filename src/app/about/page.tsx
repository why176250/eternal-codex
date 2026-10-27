import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & editorial standards",
  description:
    "How Eversixty verifies World of Warcraft: Forever guides, what our confidence levels mean, and how to report a correction.",
  alternates: { canonical: "/about" },
};

const confidence = [
  {
    level: "Verified in build",
    body: "Confirmed against official Blizzard posts or the live client/PTR. We cite the source and re-check after patches.",
    tone: "text-teal border-teal/30 bg-teal/5",
  },  {
    level: "Community-tracked",
    body: "Documented from beta coverage and community testing. Solid enough to plan around, but Blizzard can still change it.",
    tone: "text-gold border-gold/30 bg-gold/5",
  },
  {
    level: "Classic baseline",
    body: "Behavior inherited from the Classic-era game Forever is built on. Identity and structure are stable; numbers need in-game confirmation.",
    tone: "text-muted border-line bg-panel",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">About</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            A guide site that shows its work
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Eversixty exists because launch week is the worst time to trust a
            guide that does not say where its numbers came from. Every article
            here states its confidence level, its last update, and its sources.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-12">
          <div>
            <h2 className="display text-xl text-parchment">What this site is for</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              World of Warcraft: Forever is a level-60 Classic+ release with new
              race and class combinations, a ruleset-first realm structure, and a
              second talent spec at level 40. The guides here are written for
              players on the international realms who want to make one good
              decision at a time instead of reading a 10,000-word encyclopedia
              before launch night.
            </p>
          </div>

          <div>
            <h2 className="display text-xl text-parchment">Editorial standards</h2>
            <div className="mt-4 space-y-3">
              {confidence.map((item) => (
                <div key={item.level} className={`rounded-lg border p-4 ${item.tone}`}>
                  <p className="text-sm font-medium">{item.level}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We do <strong className="text-parchment">not</strong> publish
              datamined client files, leaked spreadsheets, or data copied
              wholesale from other databases. If we cannot verify something, the
              page says so instead of guessing.
            </p>
          </div>

          <div id="corrections" className="scroll-mt-24">
            <h2 className="display text-xl text-parchment">Corrections</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              If a number, zone, or mechanic changed, tell us. Include the guide
              URL, what is wrong, and the source you saw it in. Corrections are
              reflected in the guide&apos;s update line, and substantive fixes are
              noted here.
            </p>
            <p className="mt-4 text-sm">
              <a
                href="mailto:corrections@eversixty.example"
                className="text-gold/90 transition-colors hover:text-gold-soft"
              >
                corrections@eversixty.example
              </a>{" "}
              <span className="text-xs text-muted">
                (placeholder address — swap in the real inbox before launch)
              </span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              We aim to turn around corrections within 24 hours during launch
              week.
            </p>
          </div>

          <div>
            <h2 className="display text-xl text-parchment">What we will not do</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>• No paywalled guides, paid builds, or private Discord tiers.</li>
              <li>• No gold selling, boosting services, or RMT-adjacent ads.</li>
              <li>• No ad scripts or trackers in the launch build.</li>
              <li>• No datamined or leaked data presented as guide content.</li>
            </ul>
          </div>

          <div>
            <h2 className="display text-xl text-parchment">Roadmap</h2>
            <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>1. Launch hub: rulesets, release timing, free-to-play FAQ.</li>
              <li>2. Leveling routes 1–60 by faction, with dungeon checkpoints.</li>
              <li>3. Per-class pre-raid best-in-slot and talent builds.</li>
              <li>4. Addon compatibility list by ruleset.</li>
              <li>5. Hardcore preparation guide for when that ruleset opens.</li>
              <li>6. Gold routes and auction-house economics after week one.</li>
            </ol>
          </div>

          <div>
            <h2 className="display text-xl text-parchment">Independence & legal</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Eversixty is an independent, fan-made resource. It is not
              affiliated with or endorsed by Blizzard Entertainment. World of
              Warcraft and Blizzard Entertainment are trademarks of Blizzard
              Entertainment, Inc. The site keeps a visible fan-site disclaimer in
              the footer and does not use official logos as site branding.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The design holds a free-to-access, no-login model so that the
              content stays within the spirit of Blizzard&apos;s fan-site terms.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel p-5 text-sm">
            <p className="eyebrow">Quick links</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/guides" className="text-muted hover:text-gold-soft">
                  All guides →
                </Link>
              </li>
              <li>
                <Link href="/database" className="text-muted hover:text-gold-soft">
                  Item database →
                </Link>
              </li>
              <li>
                <Link href="/dungeons" className="text-muted hover:text-gold-soft">
                  Dungeon ladder →
                </Link>
              </li>
            </ul>
          </div>
          <div className="panel p-5 text-xs leading-relaxed text-muted">
            <p className="eyebrow">Build info</p>
            <p className="mt-3">
              MVP build · seed data 2026-10-26 · Next.js static-first · no
              analytics.
            </p>
            <p className="mt-3">
              Launch window: November 4, 2026. Hardcore ruleset and other systems
              will be added as they open.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
