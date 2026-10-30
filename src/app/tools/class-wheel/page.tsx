import type { Metadata } from "next";
import { ClassWheel } from "@/components/ClassWheel";

export const metadata: Metadata = {
  title: "Class wheel — random Forever class picker",
  description: "Spin a class wheel to pick a random World of Warcraft: Forever class. Pure front-end, for fun only.",
  alternates: { canonical: "/tools/class-wheel", languages: { en: "/tools/class-wheel", "zh-Hans": "/zh/tools/class-wheel", "x-default": "/tools/class-wheel" } },
};

export default function ClassWheelPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-10 md:py-14">
          <p className="eyebrow">Tools · Class wheel</p>
          <h1 className="display mt-2 text-3xl text-parchment md:text-5xl">Class wheel</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Not sure what to play? Spin the wheel and let it choose. Nine classes,
            one random pick.
          </p>
        </div>
      </section>
      <section className="container-x py-8">
        <ClassWheel />
        <p className="mt-6 text-[11px] leading-relaxed text-muted/60">
          For entertainment only. The wheel runs entirely in your browser and does
          not send anything anywhere.
        </p>
      </section>
    </main>
  );
}
