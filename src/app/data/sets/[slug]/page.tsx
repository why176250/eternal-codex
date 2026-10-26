import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foreverSets } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

type Params = { slug: string };

const classEn: Record<string, string> = {
  "全部/通用": "All / General",
  "战士": "Warrior",
  "圣骑士": "Paladin",
  "骑士": "Paladin",
  "猎人": "Hunter",
  "盗贼": "Rogue",
  "牧师": "Priest",
  "萨满": "Shaman",
  "法师": "Mage",
  "术士": "Warlock",
  "德鲁伊": "Druid",
  "死亡骑士": "Death Knight",
};

export function generateStaticParams(): Params[] {
  return foreverSets.map((set) => ({ slug: String(set.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const set = foreverSets.find((s) => String(s.id) === slug);
  if (!set) return { title: "Set not found" };
  const label = set.nameEn ?? set.name;
  return {
    title: `${label} — item set`,
    description: `${label}${set.nameEn ? ` (${set.name})` : ""}: ${set.itemCount} pieces. ${set.class}.`,
    alternates: { canonical: `/data/sets/${set.id}` },
  };
}

export default async function SetPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const set = foreverSets.find((s) => String(s.id) === slug);
  if (!set) notFound();

  return (
    <main>
      <div className="container-x pt-8 text-xs text-muted">
        <Link href="/data" className="hover:text-gold-soft">Data</Link>{" "}
        / <Link href="/data/sets" className="hover:text-gold-soft">Sets</Link>{" "}
        / <span className="text-parchment/80">{set.nameEn ?? set.name}</span>
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">{classEn[set.class] ?? set.class}</span>
            <span className="text-muted">{set.itemCount} pieces</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-4xl">
            {set.nameEn ?? set.name}
          </h1>
          {set.nameEn ? (
            <p className="mt-1 text-sm text-muted">{set.name}</p>
          ) : null}

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {set.items.map((item) => (
              <li key={item.id} className="panel flex items-center gap-3 p-3 text-sm">
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 shrink-0 rounded border border-line"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-parchment">{item.name}</p>
                  <p className="text-[11px] text-muted">#{item.id}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ForeverSourceNote />
          </div>
        </div>
      </section>
    </main>
  );
}
