import type { Metadata } from "next";
import Link from "next/link";
import { TalentPlanner } from "@/components/TalentPlanner";
import { foreverTalents } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Talent planner — all nine classes",
  description:
    "Browse and allocate talent points for all nine Forever classes. Talent data imported from the Sargeras community dataset.",
  alternates: { canonical: "/tools/talents" },
};

export default function TalentsPage() {
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/tools" className="hover:text-gold-soft">Tools</Link>{" "}
        / <span className="text-parchment/80">Talent Planner</span>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-8 md:px-8">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="badge badge-teal">Live</span>
            <span className="text-muted">天赋模拟</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            Talent planner
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            All nine classes, three trees each. Click a talent to add a point;
            the counter and rank text update as you go.
          </p>

          <div className="mt-8">
            <TalentPlanner classes={foreverTalents} />
          </div>

          <div className="mt-8">
            <ForeverSourceNote />
          </div>
        </div>
      </section>
    </main>
  );
}
