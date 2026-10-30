import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Server status — Forever",
  description: "Eversixty server-status page and current data coverage.",
  alternates: { canonical: "/server-status", languages: { en: "/server-status", "zh-Hans": "/zh/server-status", "x-default": "/server-status" } },
};

const modules = [
  ["Item database", "Live", "7,823 English-named items"],
  ["Spellbook", "Live", "31,928 spells"],
  ["Races", "Live", "10 races"],
  ["Quests", "Live", "401 quests"],
  ["Map", "Live", "901 places · 3,395 POIs"],
  ["Transmog", "Live", "536 item sets"],
];

export default function ServerStatusPage() {
  return (
    <main>
      <section className="border-b border-line/60">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Server status</p>
          <h1 className="display mt-3 text-3xl text-parchment md:text-5xl">Status & data coverage</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Realm status requires an official Forever status feed. Eversixty does
            not invent uptime numbers; this page reports the status of the site
            and its datasets.
          </p>
        </div>
      </section>
      <section className="container-x max-w-3xl py-10">
        <div className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="display text-xl text-parchment">Eversixty</h2><p className="mt-1 text-xs text-muted">All public modules are online.</p></div>
            <span className="badge badge-teal">Online</span>
          </div>
        </div>
        <div className="panel mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-deep/60 text-[10px] uppercase tracking-wider text-muted"><tr><th className="px-4 py-2 text-left font-normal">Module</th><th className="px-3 py-2 text-left font-normal">Status</th><th className="px-4 py-2 text-left font-normal">Coverage</th></tr></thead>
            <tbody>{modules.map(([name, status, coverage]) => <tr key={name} className="border-t border-line/40"><td className="px-4 py-2 text-parchment">{name}</td><td className="px-3 py-2 text-gold/85">{status}</td><td className="px-4 py-2 text-muted">{coverage}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">Realm uptime is not connected yet. Use the official Forever announcement channels for live server status.</p>
        <Link href="/patch-notes" className="mt-6 inline-block text-sm text-gold/90 hover:text-gold-soft">Read site updates →</Link>
      </section>
    </main>
  );
}
