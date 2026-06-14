import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sponsor/creator protection
  if (pathname.startsWith("/sponsor")) {
    if (pathname === "/sponsor/login") return NextResponse.next();

    const creatorId = request.cookies.get("creator_id")?.value;
    if (!creatorId) {
      return NextResponse.redirect(new URL("/sponsor/login", request.url));
    }
    return NextResponse.next();
  }

  // Admin protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const token  = request.cookies.get("admin_token")?.value;
    const secret = process.env.ADMIN_SECRET;

    if (!token || !secret || token !== secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sponsor/:path*", "/admin/:path*", "/api/admin/:path*"],
};
