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

function getQuestionIndex(publicId: string) {
  const match = publicId.match(/-q(\d+)$/);
  return match ? Number(match[1]) - 1 : 0;
}

function getSessionId(publicId: string) {
  const fileName = publicId.split("/").pop() || "";
  return fileName.replace(/-q\d+$/, "");
}

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Cloudinary environment variables",
        },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/stories/community&max_results=100&context=true`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error?.message || "Cloudinary error",
        },
        { status: response.status }
      );
    }

    const sessions: Record<string, any> = {};

    (data.resources || []).forEach((video: any) => {
      const parsed = parseFromPublicId(video.public_id);
      const questionIndex = getQuestionIndex(video.public_id);
      const sessionId = getSessionId(video.public_id);
      const consent = video.context?.custom?.consent === "true";

      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          sessionId,
          name: parsed.name,
          substance: parsed.substance,
          stage: "Recovery",
          ageRange: parsed.ageRange,
          sex: parsed.sex,
          location: parsed.location,
          createdAt: video.created_at,
          answerCount: 0,
          firstVideo: video.secure_url,
          answers: {},
          consent: false,
        };
      }

      if (consent) {
        sessions[sessionId].consent = true;
      }

      sessions[sessionId].answers[questionIndex] = video.secure_url;

      if (questionIndex === 0) {
        sessions[sessionId].firstVideo = video.secure_url;
      }

      sessions[sessionId].answerCount = Object.keys(
        sessions[sessionId].answers
      ).length;
    });

    const stories = Object.values(sessions)
      .filter((s: any) => s.consent === true)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load stories",
      },
      { status: 500 }
    );
  }
}