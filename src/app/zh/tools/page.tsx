import type { Metadata } from "next";
import Page from "@/app/tools/page";
export const metadata: Metadata = { title: "工具 — 魔兽世界：无限", alternates: { canonical: "/zh/tools", languages: { en: "/tools", "zh-Hans": "/zh/tools", "x-default": "/tools" } } };
export default function ZhToolsPage() { return <Page />; }
