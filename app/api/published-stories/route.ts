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
  consent: boolean;
  answers: Record<number, string>;
};

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression(
        "resource_type:video AND folder=livesoberaf/stories/community"
      )
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    const sessions: Record<string, StorySession> = {};

    result.resources.forEach((video: any) => {
      const context = video.context?.custom || {};

      const sessionId = context.sessionId;

      if (!sessionId) return;

      const questionIndex = Number(context.questionIndex);

      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          sessionId,
          name: context.name || "Anonymous",
          substance: context.substance || "Recovery",
          stage: context.stage || "",
          ageRange: context.ageRange || "",
          sex: context.sex || "",
          location: context.location || "",
          consent: context.consent === "true",
          answers: {},
        };
      }

      sessions[sessionId].answers[questionIndex] = video.secure_url;
    });

    const publishedSessions = Object.values(sessions)
      .filter(
        (session) =>
          session.consent &&
          Object.keys(session.answers).length >= 20
      )
      .sort((a, b) => {
        return (
          Object.keys(b.answers).length -
          Object.keys(a.answers).length
        );
      });

    return NextResponse.json({
      sessions: publishedSessions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { sessions: [] },
      { status: 500 }
    );
  }
}