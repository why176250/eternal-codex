import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
  const headers = new Headers(request.headers);
  headers.set("x-eversixty-locale", isZh ? "zh-Hans" : "en");
  headers.set("x-eversixty-pathname", pathname);

  if (pathname.startsWith("/zh/")) {
    const url = request.nextUrl.clone();
    const rest = pathname.replace(/^\/zh/, "");
    if (rest === "/data/items") url.pathname = "/items";
    else if (rest === "/data/spells") url.pathname = "/spells";
    else if (rest === "/data/npcs") url.pathname = "/npcs";
    else if (rest.startsWith("/guides/") && !rest.startsWith("/guides/forever/")) url.pathname = `/guides/forever/${rest.slice("/guides/".length)}`;
    else url.pathname = rest || "/";
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
