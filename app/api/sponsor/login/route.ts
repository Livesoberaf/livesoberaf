import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const { accessCode } = await request.json();

  if (!accessCode) {
    return NextResponse.json({ error: "Access code required." }, { status: 400 });
  }

  const { data: creator, error } = await getSupabaseAdmin()
    .from("creators")
    .select("id, name")
    .eq("access_code", accessCode)
    .single();

  if (error || !creator) {
    return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("creator_id", creator.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
