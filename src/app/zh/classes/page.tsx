import type { Metadata } from "next";
import Page from "@/app/classes/page";
export const metadata: Metadata = { title: "职业攻略 — 魔兽世界：无限", alternates: { canonical: "/zh/classes", languages: { en: "/classes", "zh-Hans": "/zh/classes", "x-default": "/classes" } } };
export default function ZhClassesPage() { return <Page />; }
