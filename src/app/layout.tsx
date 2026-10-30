import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageArt } from "@/components/PageArt";
import { LangSync } from "@/components/LangSync";
import { ZhTranslate } from "@/components/ZhTranslate";
import { headers } from "next/headers";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "WoW Infinite",
    "World of Warcraft Infinite",
    "WoW Infinite guides",
    "WoW Infinite leveling",
    "WoW Infinite classes",
    "WoW Infinite database",
    "WoW Infinite rulesets",
    "classic plus guide",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  icons: {
    icon: [{ url: "/brand/eversixty-mark.svg", type: "image/svg+xml" }],
    shortcut: "/brand/eversixty-mark.svg",
    apple: "/brand/eversixty-mark.svg",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eversixty — tools, guides, and data for World of Warcraft: Forever",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const lang = requestHeaders.get("x-eversixty-locale") === "zh-Hans" ? "zh-Hans" : "en";
  return (
    <html lang={lang}>
      <body>
        <LangSync />
        <ZhTranslate />
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="relative">
            <PageArt />
            <div className="relative z-10">{children}</div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
