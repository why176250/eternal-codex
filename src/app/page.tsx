import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import { modules } from "@/lib/modules";

export default function HomePage() {
  return (
    <main>
      <section className="container-x pb-20 pt-12 md:pt-16">
        <Link href="/" className="inline-flex items-center gap-4">
          <img
            src="/icon.svg"
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

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="panel panel-hover group flex h-full flex-col p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-lg border border-gold/30 bg-gold/5 text-gold-soft transition-colors group-hover:border-gold/60">
                  <ModuleIcon id={module.id} />
                </span>
                <span className="display text-sm text-gold/50">{module.number}</span>
              </div>
              <h2 className="display mt-5 text-xl text-parchment">{module.title}</h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted/80">
                {module.zh}
              </p>
              <p className="mt-3 text-sm font-medium text-parchment/90">
                {module.question}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{module.body}</p>
              <span className="mt-auto pt-6 text-xs text-gold/90">
                Open module →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
