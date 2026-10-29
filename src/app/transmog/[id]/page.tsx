import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemSet } from "@/lib/transmog-db";
import { getDbItem } from "@/lib/items-db";

type Params = { id: string };
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const set = getItemSet(id);
  if (!set) return { title: "Set not found" };
  return { title: `${set.name} — transmog set`, description: `${set.name}: ${set.itemCount} pieces for ${set.class}.`, alternates: { canonical: `/transmog/${set.id}` } };
}

export default async function SetPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const set = getItemSet(id);
  if (!set) notFound();
  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted"><Link href="/transmog" className="hover:text-gold-soft">Transmog</Link> / <span className="text-parchment/80">{set.name}</span></div>
      <section className="container-x max-w-3xl pb-20 pt-8">
        <p className="eyebrow">Transmog set · {set.class}</p>
        <h1 className="display mt-2 text-3xl text-parchment md:text-4xl">{set.name}</h1>
        <p className="mt-2 text-sm text-muted">{set.itemCount} pieces</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {set.items.map((piece) => {
            const db = getDbItem(piece.id);
            return (
              <Link key={piece.id} href={`/items/${piece.id}`} className="panel flex items-center gap-3 p-3">
                <img src={piece.icon} alt="" width={36} height={36} className="size-9 rounded border border-line/80" />
                <span className="min-w-0"><span className="block truncate text-sm capitalize text-parchment">{db?.name ?? piece.name}</span><span className="text-[10px] text-muted">Item #{piece.id}</span></span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
