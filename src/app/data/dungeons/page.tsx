import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { foreverDungeons } from "@/lib/forever";
import { ForeverSourceNote } from "@/components/ForeverSourceNote";

export const metadata: Metadata = {
  title: "Dungeon data — Forever instances and routes",
  description:
    "All 45 Forever dungeons, raids, and travel routes with level bands, locations, and notes, imported from the Sargeras community dataset.",
  alternates: { canonical: "/data/dungeons", languages: { en: "/data/dungeons", "zh-Hans": "/zh/data/dungeons", "x-default": "/data/dungeons" } },
};

export default function DungeonDataPage() {
  redirect("/dungeons");
}
