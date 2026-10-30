import { NextResponse, type NextRequest } from "next/server";

const dungeonAlias: Record<string, string> = {
  hot: "hall-of-thanes",
  bfd: "blackfathom-deeps",
};

const zhClasses = new Set(["warrior","paladin","hunter","rogue","priest","shaman","mage","warlock","druid"]);
const zhBis = zhClasses;
const zhProfessions = new Set(["alchemy","blacksmithing","tailoring","engineering","enchanting","leatherworking","cooking","first-aid","mining","herbalism","fishing","skinning"]);
const zhGuides = new Set(["battle-mage","druid-cat-form","library-books","cozy-sleeping-bag","rares","whimsyfin"]);
const zhDungeons = new Set(["hall-of-thanes","ragefire-chasm","blackfathom-deeps","excavation-site","city-of-dalaran","scarlet-monastery-library","scarlet-monastery-cathedral","uldaman","sunken-temple","dire-maul-east","dire-maul-north","scholomance","alcaz-prison","blackmaw-hold","blackrock-depths","dire-maul-west","gnomeregan","kroldok-stronghold","lower-blackrock-spire","maraudon","razorfen-downs","razorfen-kraul","ruins-of-lordaeron","scarlet-monastery-armory","scarlet-monastery-graveyard","shadowfang-keep","shapers-terrace","stratholme-main-gate","stratholme-service-gate","the-deadmines","the-drowned-city","the-stockade","upper-blackrock-spire","wailing-caverns","zulfarrak","hot","bfd"]);
const zhCore = new Set([
  "/zh", "/zh/dungeons", "/zh/classes", "/zh/bis",
  "/zh/professions", "/zh/data", "/zh/tools", "/zh/guides",
  "/zh/spells", "/zh/races", "/zh/quests", "/zh/transmog",
]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
  const headers = new Headers(request.headers);
  headers.set("x-eversixty-locale", isZh ? "zh-Hans" : "en");
  headers.set("x-eversixty-pathname", pathname);

  function rewrite(path: string, search?: URLSearchParams) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    if (search) url.search = search.toString();
    return NextResponse.rewrite(url, { request: { headers } });
  }

  if (isZh && !zhCore.has(pathname)) {
    const rest = pathname.replace(/^\/zh/, "");
    if (rest.startsWith("/classes/")) {
      const slug = rest.slice("/classes/".length);
      if (zhClasses.has(slug)) return NextResponse.next({ request: { headers } });
      return rewrite(`/classes/${slug}`);
    }
    if (rest.startsWith("/items/")) return NextResponse.next({ request: { headers } });
    if (rest.startsWith("/dungeons/")) {
      const slug = rest.slice("/dungeons/".length);
      if (zhDungeons.has(slug)) return NextResponse.next({ request: { headers } });
      return rewrite(`/dungeons/${slug}`);
    }
    if (rest.startsWith("/bis/")) {
      const slug = rest.slice("/bis/".length);
      if (zhBis.has(slug)) return NextResponse.next({ request: { headers } });
      return rewrite(`/bis/${slug}`);
    }
    if (rest.startsWith("/professions/")) {
      const slug = rest.slice("/professions/".length);
      if (zhProfessions.has(slug)) return NextResponse.next({ request: { headers } });
      return rewrite("/professions", new URLSearchParams({ p: slug }));
    }
    if (rest.startsWith("/guides/")) {
      const slug = rest.slice("/guides/".length);
      if (zhGuides.has(slug)) return NextResponse.next({ request: { headers } });
      return rewrite(`/guides/${slug}`);
    }
    if (rest === "/data/items") return NextResponse.next({ request: { headers } });
    if (rest === "/data/dungeons") return rewrite("/dungeons");

    return rewrite(rest || "/");
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
