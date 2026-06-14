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
    .from("creators")
    .select("id, name, pathway, region, sex, age_range, access_code, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: "Failed to fetch creators." }, { status: 500 });
  return NextResponse.json({ creators: data });
}

export async function POST(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { name, pathway, region, sex, age_range, access_code } = await request.json();

  if (!name || !pathway || !region || !sex || !access_code) {
    return NextResponse.json({ error: "name, pathway, region, sex and access_code are required." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("creators")
    .insert({ name, pathway, region, sex, age_range: age_range ?? "", access_code })
    .select("id, name, pathway, region, sex, age_range, access_code, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That access code is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create creator." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, creator: data });
}

export async function DELETE(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

  const { error } = await getSupabaseAdmin().from("creators").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete creator." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
