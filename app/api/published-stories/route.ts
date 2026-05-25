import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";

function parseFromPublicId(publicId: string) {
  const fileName = publicId.split("/").pop() || "";
  const parts = fileName.split("-");

  return {
    name: parts[0] || "Anonymous",
    substance: parts[1] || "Recovery",
    location: parts[2] || "",
    ageRange: `${parts[3] || ""}-${parts[4] || ""}`,
    sex: parts[5] || "",
  };
}

export async function GET() {
  try {
    const results = await cloudinary.search
      .expression("folder:livesoberaf/stories/community")
      .sort_by("created_at", "desc")
      .max_results(500)
      .with_field("context")
      .execute();

    const sessions: Record<string, any> = {};

    results.resources.forEach((video: any) => {
      const context = video.context?.custom || {};
      const parsed = parseFromPublicId(video.public_id);

      const sessionId = context.sessionId || video.public_id;
      const questionIndex = Number(context.questionIndex || 0);

      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          sessionId,
          name: context.name || parsed.name || "Anonymous",
          substance: context.substance || parsed.substance || "Recovery",
          stage: context.stage || "",
          ageRange: context.ageRange || parsed.ageRange || "",
          sex: context.sex || parsed.sex || "",
          location: context.location || parsed.location || "",
          createdAt: video.created_at,
          answers: {},
        };
      }

      sessions[sessionId].answers[questionIndex] = video.secure_url;
    });

    const stories = Object.values(sessions).map((session: any) => ({
      ...session,
      answerCount: Object.keys(session.answers).length,
      firstVideo: session.answers[0] || Object.values(session.answers)[0],
    }));

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch stories." },
      { status: 500 }
    );
  }
}