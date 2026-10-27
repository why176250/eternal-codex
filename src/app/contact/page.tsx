import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact & corrections",
  description:
    "Report a data error, request a correction, or contact Eversixty about the site.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Corrections &amp; contact
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Found a wrong number, a broken link, or a piece of Blizzard-owned
            material that should not be here? Tell us what page and what is wrong.
          </p>
        </div>
      </section>

      <section className="container-x max-w-3xl space-y-8 py-12 text-sm leading-relaxed text-muted md:text-base">
        <div className="panel p-6">
          <p className="eyebrow">Email</p>
          <a
            href="mailto:corrections@eversixty.com"
            className="display mt-3 block text-2xl text-gold-soft hover:text-gold"
          >
            corrections@eversixty.com
          </a>
          <p className="mt-3 text-sm text-muted">
            We usually reply within 2–3 business days. No account support, boosting,
            or gold requests.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">What to include</h2>
          <ul className="mt-3 space-y-2">
            <li>• The page URL and the exact item, talent, quest, or reward name.</li>
            <li>• What you expected versus what the page says.</li>
            <li>• A screenshot or source link if you have one.</li>
            <li>• Your client build or region, if the value is version-specific.</li>
          </ul>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Takedown requests</h2>
          <p className="mt-3">
            If you represent a rights holder and believe material on this site
            should be removed, email us with the URL and the basis for the request.
            We will review it promptly.
          </p>
        </div>

        <p className="text-xs text-muted/70">
          See also{" "}
          <Link href="/privacy" className="text-gold/90 hover:text-gold-soft">
            privacy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-gold/90 hover:text-gold-soft">
            terms
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
