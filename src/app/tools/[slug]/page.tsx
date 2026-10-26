import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toolItems } from "@/lib/sections";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Params = { slug: string };

const planned = toolItems.filter((tool) => tool.status === "planned");

export function generateStaticParams(): Params[] {
  return planned.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = planned.find((t) => t.slug === slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: `${tool.label} — planned`,
    description: `${tool.label} for World of Warcraft: Forever. ${tool.summary}`,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tool = planned.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <main>
      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { href: "/tools", label: "Tools" },
            { href: `/tools/${tool.slug}`, label: tool.label },
          ]}
        />
      </div>

      <section className="container-x pb-20 pt-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge">Planned</span>
            <span className="text-muted">{tool.zh}</span>
          </div>
          <h1 className="display mt-4 text-3xl text-parchment md:text-5xl">
            {tool.label}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {tool.summary}
          </p>

          <div className="gold-rule my-8" />

          <h2 className="display text-xl text-parchment">What will be here</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {tool.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="panel mt-8 p-5 text-sm leading-relaxed text-muted">
            <p className="font-medium text-parchment">Status</p>
            <p className="mt-1">
              This tool is not live yet. Even the page ships without numbers:
              publishing a calculator on guesses would undermine every verified
              page around it. Check the{" "}
              <Link href="/guides" className="text-gold/90 hover:text-gold-soft">
                guides
              </Link>{" "}
              for the decisions you can make today.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/tools"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              All tools
            </Link>
            <Link
              href="/bis"
              className="rounded-lg border border-line px-4 py-2 text-muted transition-colors hover:border-gold/40 hover:text-parchment"
            >
              BiS checklists
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
