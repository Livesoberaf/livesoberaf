import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/sponsor/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
  );
  response.cookies.set("sponsor_token", "", { maxAge: 0, path: "/" });
  return response;
}
