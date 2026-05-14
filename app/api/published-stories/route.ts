import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";

type StorySession = {
  sessionId: string;
  name: string;
  substance: string;
  stage: string;
  ageRange: string;
  sex: string;
  location: string;
  answers: Record<number, string>;
  createdAt?: string;
  updatedAt?: string;
};

export async function GET() {
  try {
   const result = await cloudinary.search
  .expression("resource_type:video AND folder=livesoberaf/stories/foundation")
  .sort_by("public_id", "desc")
  .max_results(500)
  .execute(); 

    const sessions: Record<string, StorySession> = {};

    result.resources.forEach((video: any) => {
      const context = video.context?.custom || {};

      const sessionId =
        context.sessionId ||
        video.public_id?.split("/").pop()?.split("-q")[0];

      const questionIndex = Number(context.questionIndex ?? 0);

      if (!sessionId) return;

      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          sessionId,
          name: context.name || "Anonymous",
          substance: context.substance || "Recovery",
          stage: context.stage || "",
          ageRange: context.ageRange || "",
          sex: context.sex || "",
          location: context.location || "",
          answers: {},
          createdAt: video.created_at,
          updatedAt: video.created_at,
        };
      }

      sessions[sessionId].answers[questionIndex] = video.secure_url;
      sessions[sessionId].updatedAt = video.created_at;
    });

    const publishedSessions = Object.values(sessions)
      .filter((session) => Object.keys(session.answers).length > 0)
      .sort((a, b) => {
        const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bDate - aDate;
      });

    return NextResponse.json({
      sessions: publishedSessions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ sessions: [] }, { status: 500 });
  }
}