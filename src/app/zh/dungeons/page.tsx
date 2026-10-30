import type { Metadata } from "next";
import Page from "@/app/dungeons/page";
export const metadata: Metadata = { title: "副本资料 — 魔兽世界：无限", alternates: { canonical: "/zh/dungeons" } };
export default function ZhDungeonsPage() { return <Page />; }
