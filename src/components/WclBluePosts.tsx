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
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? posts : posts.slice(0, 5);
  return (
    <div>
      <div className="space-y-0 divide-y divide-line/40">
        {visible.map((post) => (
          <article key={post.id} className="py-5 first:pt-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted"><time>{post.dateLabel}</time><span className="text-muted/50">·</span><span>{post.author}</span></div>
            <h3 className="mt-1 text-base font-semibold text-parchment"><a href={post.url} target="_blank" rel="noreferrer" className="hover:text-gold-soft">{post.title} ↗</a></h3>
            <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">{post.paras.map((para, index) => <p key={index}>{para}</p>)}</div>
            <a href={post.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-gold/80 hover:text-gold-soft">View original post →</a>
          </article>
        ))}
      </div>
      {posts.length > 5 ? <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-4 rounded border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment">{showAll ? "Show fewer posts" : `View all ${posts.length} posts`}</button> : null}
    </div>
  );
}
