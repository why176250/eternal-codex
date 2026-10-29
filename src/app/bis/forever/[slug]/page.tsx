import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getForeverBis } from "@/lib/bis-forever";

type Params = { slug: string };
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const list = getForeverBis(slug);
  if (!list) return { title: "BIS list not found" };
  return { title: `${list.class} ${list.spec} ${list.mode} level ${list.level} BIS`, description: `Forever BIS list for ${list.class} ${list.spec}, ${list.mode}, level ${list.level}.`, alternates: { canonical: `/bis/forever/${list.slug}` } };
}
export default async function ForeverBisDetail({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const list = getForeverBis(slug);
  if (!list) notFound();
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/bis" className="hover:text-gold-soft">BiS</Link> / <Link href="/bis/forever" className="hover:text-gold-soft">Forever lists</Link> / <span className="text-parchment/80">{list.class} {list.spec}</span></div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <p className="eyebrow">BIS · Level {list.level} · {list.mode}</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{list.class} {list.spec}</h1>
        <div className="mt-6 space-y-2">
          {list.slots.map((slot) => (
            <div key={slot.slot} className="flex items-center justify-between gap-4 rounded-lg border border-line/60 bg-deep/30 px-4 py-2.5 text-sm">
              <span className="text-muted">{slot.slot}</span>
              <span className="text-right text-parchment">{slot.item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
