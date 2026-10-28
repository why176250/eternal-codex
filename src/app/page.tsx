import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import { modules } from "@/lib/modules";

export default function HomePage() {
  return (
    <main>
      <section className="container-x pb-20 pt-12 md:pt-16">
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
          <span>Launch {new Date("2026-11-04T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="hidden text-muted/40 sm:inline">·</span>
          <span>No account, no paywall</span>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              style={{ "--accent": module.accent } as React.CSSProperties}
              className="panel panel-hover group relative flex h-full flex-col overflow-hidden p-6"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, ${module.accent}80, transparent)`,
                }}
              />
              <span
                className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: module.accent }}
              />

              <div className="relative flex items-start justify-between gap-3">
                <span className="accent-tile grid size-12 place-items-center rounded-xl border transition-colors">
                  <ModuleIcon id={module.id} />
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted/80">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: module.accent }}
                    />
                    Live
                  </span>
                  <span className="display text-sm text-gold/45">{module.number}</span>
                </div>
              </div>

              <h2 className="display relative mt-5 text-[1.35rem] leading-tight text-parchment">
                {module.title}
              </h2>
              <p className="relative mt-1 text-[11px] uppercase tracking-[0.16em] text-muted/70">
                {module.zh}
              </p>

              <p className="relative mt-4 text-sm font-medium text-parchment/90">
                {module.question}
              </p>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">
                {module.body}
              </p>

              <div className="relative mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="text-xs text-gold/85">Open module</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-gold/70 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted/60">
          Six task-first modules. Every page states its source and what is still being verified.
        </p>
      </section>
    </main>
  );
}
