import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      .expression("resource_type:video")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const filteredVideos = results.resources.filter((video: any) =>
      video.public_id.includes("livesoberaf/stories/community")
    );

    const sessions: Record<string, any> = {};

    filteredVideos.forEach((video: any) => {
      const parsed = parseFromPublicId(video.public_id);

      const sessionId = video.public_id;
      const questionIndex = 0;

      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          sessionId,
          name: parsed.name,
          substance: parsed.substance,
          stage: "",
          ageRange: parsed.ageRange,
          sex: parsed.sex,
          location: parsed.location,
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
        session.answers[0] || Object.values(session.answers)[0],
    }));

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error: any) {
    console.error("CLOUDINARY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch stories.",
      },
      { status: 500 }
    );
  }
}