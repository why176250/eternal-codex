"use client";

import { useState } from "react";

type BluePost = {
  id: string;
  dateLabel: string;
  author: string;
  title: string;
  url: string;
  paras: string[];
};

export function WclBluePosts({ posts }: { posts: BluePost[] }) {
  const [expanded, setExpanded] = useState(false);
  const first = posts[0];

  if (!first) return null;

  if (!expanded) {
    return (
      <div>
        <article className="py-5 first:pt-0">
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted"><time>{first.dateLabel}</time><span className="text-muted/50">·</span><span>{first.author}</span></div>
          <h3 className="mt-1 text-base font-semibold text-parchment"><a href={first.url} target="_blank" rel="noreferrer" className="hover:text-gold-soft">{first.title} ↗</a></h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{first.paras[0]}</p>
        </article>
        <button type="button" onClick={() => setExpanded(true)} className="rounded border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Expand all {posts.length} posts</button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-0 divide-y divide-line/40">
        {posts.map((post) => (
          <article key={post.id} className="py-5 first:pt-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted"><time>{post.dateLabel}</time><span className="text-muted/50">·</span><span>{post.author}</span></div>
            <h3 className="mt-1 text-base font-semibold text-parchment"><a href={post.url} target="_blank" rel="noreferrer" className="hover:text-gold-soft">{post.title} ↗</a></h3>
            <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">{post.paras.map((para, index) => <p key={index}>{para}</p>)}</div>
            <a href={post.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-gold/80 hover:text-gold-soft">View original post →</a>
          </article>
        ))}
      </div>
      <button type="button" onClick={() => setExpanded(false)} className="mt-4 rounded border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">Collapse posts</button>
    </div>
  );
}
