import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import { LaunchCountdown } from "@/components/LaunchCountdown";
import { modules } from "@/lib/modules";

export default function HomePage() {
  return (
    <main>
      <section className="container-x pb-20 pt-12 md:pt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <img
                src="/brand/eversixty-mark.svg"
                alt="Eversixty logo"
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-2xl"
              />
              <span>
                <h1 className="display block text-3xl tracking-wide text-parchment md:text-4xl">
                  Eversixty
                </h1>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.28em] text-muted">
                  A Forever companion
                </span>
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
                Six modules live
              </span>
              <span className="hidden text-muted/40 sm:inline">·</span>
              <span>No account, no paywall</span>
            </div>
          </div>

          <LaunchCountdown />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              style={{ "--accent": module.accent } as React.CSSProperties}
              className="panel panel-hover group relative flex min-h-[104px] items-center gap-4 overflow-hidden p-4 md:p-5"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, ${module.accent}80, transparent)`,
                }}
              />
              <span
                className="pointer-events-none absolute -right-16 -top-24 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: module.accent }}
              />

              <span className="accent-tile relative grid size-12 shrink-0 place-items-center rounded-xl border transition-colors">
                <ModuleIcon id={module.id} />
              </span>

              <span className="relative min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="display block truncate text-lg text-parchment md:text-xl">
                    {module.title}
                  </span>
                  <span className="display shrink-0 text-xs text-gold/40">
                    {module.number}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-muted">{module.tagline}</span>
              </span>

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="relative shrink-0 text-gold/70 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
