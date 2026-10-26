import type { Metadata } from "next";
import Link from "next/link";
import { bisClasses, getClass } from "@/lib/data";

export const metadata: Metadata = {
  title: "BiS checklists — starter upgrades per class",
  description:
    "Phase 1 starter checklists for World of Warcraft: Forever: the upgrades worth farming first for each class and spec, with sources and farm order.",
  alternates: { canonical: "/bis" },
};

export default function BisPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">BiS checklists</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            The upgrades worth farming first
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Short, honest starter checklists instead of sixteen-slot tables full
            of guesses. Each entry names a target, its source, and the order we
            would farm it in.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bisClasses.map((entry) => {
              const wowClass = getClass(entry.classId);
              if (!wowClass) return null;
              return (
                <Link
                  key={entry.classId}
                  href={`/bis/${entry.classId}`}
                  className="panel panel-hover flex h-full flex-col p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="badge">{wowClass.roles.join(" · ")}</span>
                    <span className="text-[11px] text-muted">
                      {entry.specs.length} spec{entry.specs.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h2 className="display mt-4 text-xl" style={{ color: wowClass.accent }}>
                    {wowClass.name}
                  </h2>
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {entry.specs.map((spec) => (
                      <li key={spec.id}>
                        {spec.name} · {spec.role}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-4 text-xs text-gold/80">
                    Open checklist →
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">What these lists are not</p>
            <p className="mt-1">
              They are not full best-in-slot simulations. Forever&apos;s item
              stats are still being verified in live builds, so we list the
              upgrades we can defend — and we add specs as the data firms up. A
              short list you can trust beats a long list you cannot.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
