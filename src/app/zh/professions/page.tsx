import type { Metadata } from "next";
import Page from "@/app/professions/page";
export const metadata: Metadata = { title: "专业资料 — 魔兽世界：无限", alternates: { canonical: "/zh/professions", languages: { en: "/professions", "zh-Hans": "/zh/professions", "x-default": "/professions" } } };
export default function ZhProfessionsPage() { return <Page searchParams={Promise.resolve({})} />; }
