import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
  const headers = new Headers(request.headers);
  headers.set("x-eversixty-locale", isZh ? "zh-Hans" : "en");
  headers.set("x-eversixty-pathname", pathname);

  if (pathname.startsWith("/zh/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/zh/data/dungeons" ? "/dungeons" : (pathname.replace(/^\/zh/, "") || "/");
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
