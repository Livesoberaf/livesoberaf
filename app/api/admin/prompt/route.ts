import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token  = cookieStore.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;
  return token && secret && token === secret;
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("prompts")
    .select("id, role, trigger_type, day_number, moment, mood, event, pathway, title, brief, sequence, active")
    .order("role").order("day_number", { nullsFirst: false }).order("sequence");

  if (error) return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
  return NextResponse.json({ prompts: data });
}

export async function POST(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { role, trigger_type, day_number, moment, mood, event, pathway, title, brief, sequence } = body;

  if (!role || !trigger_type || !title || !brief) {
    return NextResponse.json({ error: "role, trigger_type, title and brief are required." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("prompts")
    .insert({
      role, trigger_type,
      day_number:  day_number  ?? null,
      moment:      moment      ?? null,
      mood:        mood        ?? null,
      event:       event       ?? null,
      pathway:     pathway     ?? null,
      title, brief,
      sequence:    sequence    ?? 0,
    })
    .select("id, title")
    .single();

  if (error) return NextResponse.json({ error: "Failed to create prompt." }, { status: 500 });
  return NextResponse.json({ ok: true, prompt: data });
}
