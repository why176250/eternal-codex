import type { Metadata } from "next";
import Link from "next/link";

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const en = `/${path}`;
  const zh = `/zh/${path}`;
  return { title: "中文版 — 建设中", alternates: { canonical: zh, languages: { en, "zh-Hans": zh, "x-default": en } } };
}

export default async function ZhFallbackPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = slug.join("/");
  return (
    <main>
      <section className="container-x max-w-3xl py-16 md:py-24">
        <p className="eyebrow">中文版 · 建设中</p>
        <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">这一页的中文正文还在翻译</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">对应英文页已经可用。中文数据库内容会按模块逐步补齐。</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${path}`} className="rounded-lg border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm text-gold-soft">打开英文页 →</Link>
          <Link href="/zh" className="rounded-lg border border-line px-4 py-2 text-sm text-muted">返回中文首页</Link>
        </div>
      </section>
    </main>
  );
}
