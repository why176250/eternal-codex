import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isZh = request.nextUrl.pathname === "/zh" || request.nextUrl.pathname.startsWith("/zh/");
  const headers = new Headers(request.headers);
  headers.set("x-eversixty-locale", isZh ? "zh-Hans" : "en");
  headers.set("x-eversixty-pathname", request.nextUrl.pathname);

  const zhCore = new Set([
    "/zh", "/zh/dungeons", "/zh/classes", "/zh/bis",
    "/zh/professions", "/zh/data", "/zh/tools", "/zh/guides",
  ]);
  if (isZh && !zhCore.has(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.replace(/^\/zh/, "") || "/";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
