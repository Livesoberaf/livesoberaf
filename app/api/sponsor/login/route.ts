import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  const correct = process.env.SPONSOR_PASSWORD;
  const secret = process.env.SPONSOR_SECRET;

  if (!correct || !secret) {
    return NextResponse.json({ error: "Server not configured." }, { status: 500 });
  }

  if (password !== correct) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sponsor_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return response;
}
