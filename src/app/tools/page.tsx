import type { Metadata } from "next";
import Link from "next/link";
import { toolItems } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Tools — talent, BiS, XP, and legacy planners",
  description:
    "Interactive tools for World of Warcraft: Forever: BiS checklists, a talent planner, and a legacy planner. Built in public.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-14 md:py-20">
          <p className="eyebrow">Tools</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">
            Plan the character before you spend the gold
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Four planners, built in public. The BiS checklists are live today;
            the calculators are next, and each page states what is verified and
            what is still being built.
          </p>
        </div>
      </section>

      <section>
        <div className="container-x py-12">
          <div className="grid gap-4 md:grid-cols-2">
            {toolItems.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="panel panel-hover flex h-full flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      tool.status === "live" ? "badge badge-teal" : "badge"
                    }
                  >
                    {tool.status === "live" ? "Live" : "Planned"}
                  </span>
                  <span className="text-[11px] text-muted">{tool.zh}</span>
                </div>
                <h2 className="display mt-4 text-xl text-parchment">
                  {tool.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {tool.summary}
                </p>
                <span className="mt-auto pt-5 text-xs text-gold/80">
                  {tool.status === "live" ? "Open tool →" : "See the plan →"}
                </span>
              </Link>
            ))}
          </div>

          <div className="panel mt-10 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Why some tools are planned</p>
            <p className="mt-1">
              A calculator that ships with wrong numbers is worse than no
              calculator. We publish tool pages when the underlying data can be
              verified in-game — not before. The BiS checklists are live because
              they list targets we can defend.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
