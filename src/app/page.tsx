import Link from "next/link";
import { getGuides } from "@/lib/guides";
import { GuideCard } from "@/components/GuideCard";
import { ModuleIcon } from "@/components/ModuleIcon";
import { modules } from "@/lib/modules";

export default function HomePage() {
  const latest = getGuides().slice(0, 3);

  return (
    <main>
      <section className="container-x pb-16 pt-10 md:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Modules · Forever launch companion</p>
            <h1 className="display mt-2 text-2xl text-parchment md:text-3xl">
              Six things players actually open
            </h1>
          </div>
          <p className="text-xs text-muted">Pick one · every page starts with an action</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <h3 className="display mt-5 text-xl text-parchment">{module.title}</h3>
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

      <section className="border-t border-line/60">
        <div className="container-x py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Fresh from the guides</p>
              <h2 className="display mt-2 text-2xl text-parchment md:text-3xl">
                What changed this week
              </h2>
            </div>
            <Link
              href="/guides"
              className="text-sm text-gold/90 transition-colors hover:text-gold-soft"
            >
              All guides →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {latest.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
