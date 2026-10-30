import type { Metadata } from "next";
import Page from "@/app/data/page";
export const metadata: Metadata = { title: "数据库 — 魔兽世界：无限", alternates: { canonical: "/zh/data" } };
export default function ZhDataPage() { return <Page />; }
