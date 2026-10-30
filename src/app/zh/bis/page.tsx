import type { Metadata } from "next";
import Page from "@/app/bis/page";
export const metadata: Metadata = { title: "BiS 配装 — 魔兽世界：无限", alternates: { canonical: "/zh/bis" } };
export default function ZhBisPage() { return <Page searchParams={Promise.resolve({})} />; }
