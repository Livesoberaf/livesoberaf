import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ALL_SLOT_IDS } from "@/lib/sponsor-content";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function slotMeta(slotId: string): { app_placement: string; day_number: number } {
  if (slotId.startsWith("day1"))   return { app_placement: "day_1",      day_number: 1  };
  if (slotId.includes("craving"))  return { app_placement: "craving",    day_number: 5  };
  if (slotId.includes("sleep"))    return { app_placement: "low_moment", day_number: 10 };
  if (slotId.startsWith("d1-3"))   return { app_placement: "early_days", day_number: 2  };
  if (slotId.startsWith("d4-7"))   return { app_placement: "week_1",     day_number: 5  };
  if (slotId.startsWith("d8-14"))  return { app_placement: "week_1",     day_number: 11 };
  if (slotId.startsWith("d15-30")) return { app_placement: "milestone",  day_number: 22 };
  if (slotId.startsWith("m2"))     return { app_placement: "milestone",  day_number: 45 };
  if (slotId.startsWith("m3"))     return { app_placement: "milestone",  day_number: 75 };
  if (slotId.startsWith("ongoing"))return { app_placement: "milestone",  day_number: 90 };
  return { app_placement: "story", day_number: 30 };
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const creatorId   = cookieStore.get("creator_id")?.value;
    if (!creatorId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    const { data: creator } = await getSupabaseAdmin()
      .from("creators")
      .select("id, name, pathway, region, sex, age_range, role")
      .eq("id", creatorId)
      .single();
    if (!creator) return NextResponse.json({ error: "Creator not found." }, { status: 401 });

    const { cloudinaryUrl, promptId, slotId } = await request.json();
    if (!cloudinaryUrl) return NextResponse.json({ error: "cloudinaryUrl required." }, { status: 400 });

    // ── Prompt-driven path ────────────────────────────────────────────────────
    if (promptId) {
      const { data: prompt } = await getSupabaseAdmin()
        .from("prompts")
        .select("id, role, trigger_type, day_number, moment, mood, event, pathway")
        .eq("id", promptId)
        .single();
      if (!prompt) return NextResponse.json({ error: "Prompt not found." }, { status: 404 });

      const contributorRole = creator.role as string;
      const isMatt          = contributorRole === "matt";
      const sessionId       = `prompt-${creator.id}-${promptId}`;

      const { data: existing } = await getSupabaseAdmin()
        .from("peer_clips")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existing) {
        await getSupabaseAdmin()
          .from("peer_clips")
          .update({ cloudinary_url: cloudinaryUrl, status: "pending" })
          .eq("session_id", sessionId);
      } else {
        await getSupabaseAdmin()
          .from("peer_clips")
          .insert({
            session_id:     sessionId,
            question_index: 0,
            sharer_name:    creator.name,
            day_number:     prompt.day_number ?? 0,
            pathway:        isMatt ? "universal" : (prompt.pathway ?? creator.pathway),
            age_range:      isMatt ? ""   : creator.age_range,
            sex:            isMatt ? ""   : creator.sex,
            region:         isMatt ? ""   : creator.region,
            cloudinary_url: cloudinaryUrl,
            status:         "pending",
            consent:        true,
            app_placement:  prompt.trigger_type === "mood"  ? "mood_response"
                          : prompt.trigger_type === "event" ? (prompt.event ?? "story")
                          : "day_1",
            prompt_id:      prompt.id,
            role:           contributorRole,
            moment:         prompt.moment,
            mood:           prompt.mood,
            event:          prompt.event,
          });
      }
      return NextResponse.json({ ok: true });
    }

    // ── Legacy slot path ──────────────────────────────────────────────────────
    if (!slotId || !ALL_SLOT_IDS.includes(slotId)) {
      return NextResponse.json({ error: "Valid promptId or slotId required." }, { status: 400 });
    }

    const { app_placement, day_number } = slotMeta(slotId);
    const sessionId = `studio-${creator.id}-${slotId}`;

    const { data: existing } = await getSupabaseAdmin()
      .from("peer_clips")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing) {
      await getSupabaseAdmin()
        .from("peer_clips")
        .update({ cloudinary_url: cloudinaryUrl, status: "pending" })
        .eq("session_id", sessionId);
    } else {
      await getSupabaseAdmin()
        .from("peer_clips")
        .insert({
          session_id:     sessionId,
          question_index: 0,
          sharer_name:    creator.name,
          day_number,
          pathway:        creator.pathway,
          age_range:      creator.age_range || "",
          sex:            creator.sex,
          region:         creator.region,
          cloudinary_url: cloudinaryUrl,
          status:         "pending",
          consent:        true,
          app_placement,
          role:           "creator",
        });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("save-clip error:", err);
    return NextResponse.json({ error: "Failed to save clip." }, { status: 500 });
  }
}
