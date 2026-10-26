import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  bisClasses,
  getClass,
  getItem,
  qualityColors,
  type BisClass,
} from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return bisClasses.map((entry) => ({ slug: entry.classId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = bisClasses.find((c) => c.classId === slug);
  const wowClass = entry ? getClass(entry.classId) : undefined;
  if (!entry || !wowClass) return { title: "BiS checklist not found" };
  return {
    title: `${wowClass.name} BiS checklist — phase 1 upgrades`,
    description: `${wowClass.name} starter checklist for World of Warcraft: Forever: the upgrades to farm first, their sources, and the farm order.`,
    alternates: { canonical: `/bis/${entry.classId}` },
  };
}

export default async function BisClassPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry: BisClass | undefined = bisClasses.find((c) => c.classId === slug);
  if (!entry) notFound();
  const wowClass = getClass(entry.classId);
  if (!wowClass) notFound();

  return (
    <main>
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-gold-soft">Home</Link></li>
            <li><span className="text-muted/50">/</span></li>
            <li><Link href="/bis" className="hover:text-gold-soft">BiS</Link></li>
            <li><span className="text-muted/50">/</span></li>
            <li className="text-parchment/80" aria-current="page">{wowClass.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <p className="eyebrow">{wowClass.roles.join(" · ")}</p>
          <h1 className="display mt-3 text-3xl md:text-5xl" style={{ color: wowClass.accent }}>
            {wowClass.name} BiS checklist
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{entry.intro}</p>

          <div className="gold-rule my-8" />

          <div className="space-y-8">
            {entry.specs.map((spec) => (
              <section key={spec.id} className="panel p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="display text-xl text-parchment">{spec.name}</h2>
                  <span className="badge">{spec.role}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{spec.summary}</p>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                        <th className="py-2 pr-4 font-medium">Slot</th>
                        <th className="py-2 pr-4 font-medium">Target</th>
                        <th className="py-2 font-medium">Why / source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spec.picks.map((pick) => {
                        const item = getItem(pick.itemId);
                        if (!item) return null;
                        return (
                          <tr key={`${pick.slot}-${pick.itemId}`} className="border-b border-line/50 last:border-0">
                            <td className="py-2.5 pr-4 text-muted">{pick.slot}</td>
                            <td className="py-2.5 pr-4">
                              <Link
                                href={`/database/items/${item.id}`}
                                className="transition-colors hover:underline hover:underline-offset-2"
                                style={{ color: qualityColors[item.quality] ?? "#ede7d7" }}
                              >
                                {item.name}
                              </Link>
                              <span className="ml-2 text-[11px] text-muted">{item.source}</span>
                            </td>
                            <td className="py-2.5 text-muted">
                              {pick.note ?? `${item.quality} · ${item.phase}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 rounded-lg border border-line/70 bg-deep/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-gold">Farm order</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
                    {spec.farmOrder.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </section>
            ))}
          </div>

          <div className="panel mt-8 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Confidence</p>
            <p className="mt-1">
              These targets are drawn from the Classic baseline and verified
              against community coverage where possible. Forever-specific stat
              changes and drop rates will be folded in after launch — each page
              carries an update date when that happens.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="/classes"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Class overviews
            </Link>
            <Link
              href="/guides/dual-spec-at-40"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              Dual spec at 40
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
