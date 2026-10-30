import type { Metadata } from "next";
import Link from "next/link";
import blue from "@/data/blizzard-blue-posts.json";
import updates from "@/data/site-updates.json";

export const metadata: Metadata = {
  title: "Patch notes — Blizzard blue posts",
  description: "Official Blizzard blue posts about WoW Forever, plus Eversixty release notes.",
  alternates: { canonical: "/patch-notes" },
};

type BluePost = {
  id: number;
  title: string;
  excerpt: string;
  createdAt: string;
  url: string;
  author: string;
  userTitle: string;
  avatar: string;
};

const posts = (blue as unknown as { posts: BluePost[]; fetchedAt: string }).posts;
const fetchedAt = (blue as unknown as { fetchedAt: string }).fetchedAt;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function PatchNotesPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Patch notes · Blizzard blue posts</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Blizzard blue posts</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            The latest official Blizzard posts about World of Warcraft: Forever.
            Every entry links back to the Blizzard forum thread.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-muted/70">
            <span className="badge">Official source</span>
            <span>Synced {formatDate(fetchedAt)}</span>
            <a href="https://us.forums.blizzard.com/en/wow/groups/blizzard-tracker/activity/posts" target="_blank" rel="noreferrer" className="text-gold/90 hover:text-gold-soft">Open the Blizzard tracker →</a>
          </div>
        </div>
      </section>

      <section className="container-x max-w-4xl py-10">
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="panel p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted">
                {post.avatar ? <img src={post.avatar} alt="" width={24} height={24} className="size-6 rounded border border-line/70 object-cover" /> : null}
                <span className="text-parchment/80">{post.author}</span>
                <span className="text-muted/50">·</span>
                <span>{post.userTitle}</span>
                <span className="ml-auto">{formatDate(post.createdAt)}</span>
              </div>
              <h2 className="display mt-2 text-xl text-parchment"><a href={post.url} target="_blank" rel="noreferrer" className="hover:text-gold-soft">{post.title}</a></h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <a href={post.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[11px] text-gold/85 hover:text-gold-soft">Read on Blizzard forums →</a>
            </article>
          ))}
        </div>

        <div className="mt-12 border-t border-line/60 pt-8">
          <p className="eyebrow">Eversixty updates</p>
          <h2 className="display mt-1 text-2xl text-parchment">Site release notes</h2>
          <div className="mt-4 space-y-3">
            {(updates as { date: string; title: string; items: string[] }[]).map((update) => (
              <article key={`${update.date}-${update.title}`} className="panel p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="display text-lg text-parchment">{update.title}</h3><span className="text-[11px] text-muted">{update.date}</span></div>
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted">{update.items.map((item) => <li key={item}>· {item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
        <Link href="/data" className="mt-6 inline-block text-sm text-gold/90 hover:text-gold-soft">Browse the database →</Link>
      </section>
    </main>
  );
}
