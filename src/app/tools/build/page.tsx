import type { Metadata } from "next";
import Link from "next/link";
import { BuildPlanner } from "@/components/BuildPlanner";
import { foreverLegacy, foreverTalents } from "@/lib/forever";

export const metadata: Metadata = {
  title: "Build planner — talent and legacy",
  description:
    "One page for both Forever progression planners: the talent calculator and the legacy path. Switch tabs without leaving the build workflow.",
  alternates: { canonical: "/tools/build", languages: { en: "/tools/build", "zh-Hans": "/zh/tools/build", "x-default": "/tools/build" } },
};

export default function BuildPage() {
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/tools" className="hover:text-gold-soft">
          Tools
        </Link>{" "}
        / <span className="text-parchment/80">Build planner</span>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-8 md:px-8">
        <div className="flex items-center gap-2 text-xs">
          <span className="badge badge-teal">Live</span>
          <span className="text-muted">天赋 · 传承模拟</span>
        </div>
        <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
          Build planner
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          The two character-progression simulators, on one page. Pick a talent
          build or plan the legacy path; your choices stay in this browser.
        </p>

        <div className="mt-8">
          <BuildPlanner classes={foreverTalents} legacy={foreverLegacy} />
        </div>
      </section>
    </main>
  );
}
