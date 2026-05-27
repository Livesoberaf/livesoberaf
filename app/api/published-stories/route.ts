import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseFromPublicId(publicId: string) {
  const fileName = publicId.split("/").pop() || "";
  const parts = fileName.split("-");

  return {
    name: parts[0] || "Anonymous",
    substance: parts[1] || "Recovery",
    location: parts[2] || "",
    ageRange: parts[3] && parts[4] ? `${parts[3]}-${parts[4]}` : "",
    sex: parts[5] || "",
  };
}

export async function GET() {
  try {
    const results = await cloudinary.api.resources({
      type: "upload",
      resource_type: "video",
      prefix: "livesoberaf/stories/community",
      max_results: 500,
      context: true,
    });

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
      firstVideo:
        session.answers[0] ||
        Object.values(session.answers)[0],
    }));

    return NextResponse.json({
      success: true,
      count: stories.length,
      stories,
    });
  } catch (error: any) {
    console.error("CLOUDINARY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}