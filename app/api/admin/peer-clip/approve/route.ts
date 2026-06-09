import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing clip ID." }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("peer_clips")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Failed to approve clip." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
