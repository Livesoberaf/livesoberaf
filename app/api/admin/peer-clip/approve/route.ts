import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing clip ID." }, { status: 400 });

  const { error } = await getSupabaseAdmin()
    .from("peer_clips")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Failed to approve clip." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
