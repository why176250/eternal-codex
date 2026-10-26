import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line/80 bg-deep/60">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-lg text-parchment">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Launch-week guides and a growing reference for World of Warcraft:
            Forever, written for players on the international realms. No
            paywalls, no gatekeeping.
          </p>
          <p className="mt-4 text-xs text-muted/80">
            Launch window: {site.launchWindow} · Seed data: {site.lastSeed}
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="eyebrow mb-3">Sections</p>
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-gold-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="eyebrow mb-3">Editorial</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/about" className="transition-colors hover:text-gold-soft">
                How we verify data
              </Link>
            </li>
            <li>
              <Link href="/about#corrections" className="transition-colors hover:text-gold-soft">
                Report a correction
              </Link>
            </li>
            <li>
              <a
                href="https://www.wowhead.com/forever"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-soft"
              >
                Wowhead Forever
              </a>
            </li>
            <li>
              <a
                href="https://www.icy-veins.com/wow-forever"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-soft"
              >
                Icy Veins Forever
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="container-x flex flex-col gap-2 py-5 text-xs leading-relaxed text-muted/70 md:flex-row md:items-center md:justify-between">
          <p>
            Fan-made community resource. Not affiliated with or endorsed by
            Blizzard Entertainment. World of Warcraft and Blizzard
            Entertainment are trademarks of Blizzard Entertainment, Inc.
          </p>
          <p>Built with Next.js. No ads, no tracking scripts.</p>
        </div>
      </div>
    </footer>
  );
}
