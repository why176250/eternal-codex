import { NextResponse, type NextRequest } from "next/server";

const dungeonAlias: Record<string, string> = {
  hot: "hall-of-thanes",
  bfd: "blackfathom-deeps",
};

const zhCore = new Set([
  "/zh", "/zh/dungeons", "/zh/classes", "/zh/bis",
  "/zh/professions", "/zh/data", "/zh/tools", "/zh/guides",
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
    if (rest.startsWith("/classes/") || rest.startsWith("/items/") || rest.startsWith("/dungeons/") || rest.startsWith("/bis/") || rest.startsWith("/professions/") || rest.startsWith("/guides/") || rest === "/data/items") {
      return NextResponse.next({ request: { headers } });
    }

    if (rest.startsWith("/dungeons/")) {
      const slug = rest.slice("/dungeons/".length);
      return rewrite(`/dungeons/${dungeonAlias[slug] ?? slug}`);
    }

    return rewrite(rest || "/");
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
