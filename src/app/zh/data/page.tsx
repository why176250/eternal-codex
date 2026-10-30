import type { Metadata } from "next";
import Page from "@/app/data/page";
export const metadata: Metadata = { title: "数据库 — 魔兽世界：无限", alternates: { canonical: "/zh/data", languages: { en: "/data", "zh-Hans": "/zh/data", "x-default": "/data" } } };
export default function ZhDataPage() { return <Page />; }
