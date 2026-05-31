import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: "Missing Cloudinary environment variables",
        cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      });
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const url =
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload` +
      `?prefix=livesoberaf/stories/community&max_results=500&context=true`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        rawError: text,
      });
    }

    const data = JSON.parse(text);
    const sessions: Record<string, any> = {};

    const resources = data.resources || [];

    resources.forEach((video: any) => {
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
      count: stories.length,
      stories,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || String(error),
    });
  }
}