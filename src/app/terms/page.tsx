import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & disclaimer",
  description:
    "Eversixty is an unofficial World of Warcraft: Forever fan site. Read the terms, accuracy disclaimer, and content-use rules.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Legal</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Terms &amp; disclaimer
          </h1>
          <p className="mt-4 text-xs text-muted">Last updated: October 27, 2026</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Eversixty is an independent, fan-made companion site. By using it, you
            accept the terms below.
          </p>
        </div>
      </section>

      <section className="container-x max-w-3xl space-y-10 py-12 text-sm leading-relaxed text-muted md:text-base">
        <div>
          <h2 className="display text-xl text-parchment">Unofficial fan site</h2>
          <p className="mt-3">
            Eversixty is not affiliated with, endorsed by, or sponsored by Blizzard
            Entertainment. World of Warcraft, World of Warcraft: Forever, and
            related names, logos, and game assets are trademarks or copyrights of
            Blizzard Entertainment, Inc. Game data and artwork remain the property
            of their respective owners.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Accuracy and no warranty</h2>
          <p className="mt-3">
            Guides, planners, and data are provided “as is” for planning purposes.
            Beta values, tooltips, and reward tracks can change before launch.
            Verify important decisions in-game. We do not warrant that any page is
            complete, current, or error-free.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Acceptable use</h2>
          <p className="mt-3">
            You may read, link to, and share pages for personal, non-commercial
            use. Do not scrape the site at scale, attempt to disrupt it, or
            republish substantial portions of our original writing without
            permission. Blizzard-owned assets are not ours to license.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Third-party links and ads</h2>
          <p className="mt-3">
            We link to external sites such as Wowhead and Icy Veins. We do not
            control their content or privacy practices. If advertising is added,
            ads will be labelled and will not change editorial conclusions.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Limitation of liability</h2>
          <p className="mt-3">
            To the extent permitted by law, Eversixty is not liable for losses
            arising from use of the site, including lost items, wasted gold,
            missed launches, or decisions based on outdated data.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Changes</h2>
          <p className="mt-3">
            We may update these terms as the site changes. The date at the top
            reflects the latest revision.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Contact</h2>
          <p className="mt-3">
            Corrections, takedown requests, or permissions:{" "}
            <a
              href="mailto:corrections@eversixty.com"
              className="text-gold/90 hover:text-gold-soft"
            >
              corrections@eversixty.com
            </a>
            . See also our{" "}
            <Link href="/privacy" className="text-gold/90 hover:text-gold-soft">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
