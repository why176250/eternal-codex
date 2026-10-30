import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Eversixty handles data: local browser storage, hosting logs, and the analytics and advertising choices that may apply.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Legal</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Privacy policy
          </h1>
          <p className="mt-4 text-xs text-muted">Last updated: October 27, 2026</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Eversixty is a free, independent fan site for World of Warcraft:
            Forever. This page explains what is stored in your browser, what our
            host sees, and what will change if we introduce analytics or
            advertising.
          </p>
        </div>
      </section>

      <section className="container-x max-w-3xl space-y-10 py-12 text-sm leading-relaxed text-muted md:text-base">
        <div>
          <h2 className="display text-xl text-parchment">What stays on your device</h2>
          <p className="mt-3">
            The talent and legacy planners can save a build in your browser using
            localStorage. That build stays on your device and is not sent to us.
            Clearing site data or using the Clear button removes it. There are no
            accounts and no server-side profiles.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">What our host sees</h2>
          <p className="mt-3">
            The site is served by Vercel. Like any web host, Vercel processes
            standard request data such as IP address, user agent, requested URL,
            and timestamps for security, abuse prevention, and performance. We do
            not use that data to identify individual readers.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Analytics</h2>
          <p className="mt-3">
            We do not currently run third-party analytics or advertising scripts.
            If we add privacy-friendly analytics, this page will name the provider
            and explain what it measures before it goes live.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Advertising</h2>
          <p className="mt-3">
            Eversixty may display advertising in the future to cover hosting
            costs. If advertising is added, ad partners may use cookies or similar
            technologies, and we will add a consent banner where required by law.
            You will be able to reject personalized advertising without losing
            access to the site.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Cookies</h2>
          <p className="mt-3">
            We do not set advertising or analytics cookies today. The planners use
            browser storage, not cookies. Future advertising or consent tooling may
            set cookies; this page will be updated before that happens.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Your choices</h2>
          <p className="mt-3">
            You can clear saved builds through the planner’s Clear button or your
            browser’s site-data settings. If you are in the EEA, UK, or California,
            you may have rights to access, correct, delete, or object to certain
            processing. Contact us and we will respond within a reasonable period.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Children</h2>
          <p className="mt-3">
            This site is not directed at children under 13, and we do not knowingly
            collect personal information from them.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Changes</h2>
          <p className="mt-3">
            If this policy changes, the date at the top will change. Material
            changes, such as adding advertising, will be called out on this page.
          </p>
        </div>

        <div>
          <h2 className="display text-xl text-parchment">Contact</h2>
          <p className="mt-3">
            Questions or requests:{" "}
            <a
              href="mailto:corrections@eversixty.com"
              className="text-gold/90 hover:text-gold-soft"
            >
              corrections@eversixty.com
            </a>
            . See also our{" "}
            <Link href="/terms" className="text-gold/90 hover:text-gold-soft">
              terms and disclaimer
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
