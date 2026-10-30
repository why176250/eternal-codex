import type { Metadata } from "next";
import HomePage from "@/app/page";
export const metadata: Metadata = { title: "Eversixty — 中文站", description: "Eversixty 中文镜像站：工具、攻略与数据库。", alternates: { canonical: "/zh", languages: { en: "/", "zh-Hans": "/zh", "x-default": "/" } } };
export default HomePage;
