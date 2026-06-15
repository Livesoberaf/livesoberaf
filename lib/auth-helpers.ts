import { cookies } from "next/headers";
import { getSupabaseAdmin } from "./supabase";

export type SessionCreator = {
  id: string;
  name: string;
  pathway: string | null;
  region: string;
  sex: string;
  age_range: string;
  role: "creator" | "matt";
};

export async function getSessionCreator(): Promise<SessionCreator | null> {
  const cookieStore = await cookies();
  const creatorId   = cookieStore.get("creator_id")?.value;
  if (!creatorId) return null;

  const { data } = await getSupabaseAdmin()
    .from("creators")
    .select("id, name, pathway, region, sex, age_range, role")
    .eq("id", creatorId)
    .single();

  return (data as SessionCreator) ?? null;
}
