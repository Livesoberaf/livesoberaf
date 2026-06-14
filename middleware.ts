import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/sponsor") && !pathname.startsWith("/sponsor/login")) {
    const creatorId = request.cookies.get("creator_id")?.value;
    if (!creatorId) {
      return NextResponse.redirect(new URL("/sponsor/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sponsor/:path*"],
};
