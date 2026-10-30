import type { Metadata } from "next";
import Page from "@/app/guides/page";
export const metadata: Metadata = { title: "攻略 — 魔兽世界：无限", alternates: { canonical: "/zh/guides", languages: { en: "/guides", "zh-Hans": "/zh/guides", "x-default": "/guides" } } };
export default function ZhGuidesPage() { return <Page />; }
