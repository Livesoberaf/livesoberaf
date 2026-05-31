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
      return NextResponse.json(
        {
          success: false,
          error: "Missing Cloudinary environment variables",
        },
        { status: 500 }
      );
    }

    const auth = Buffer.from(
      `${apiKey}:${apiSecret}`
    ).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/stories/community&max_results=3`,
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

    const stories =
      data.resources?.map((video: any) => {
        const parsed = parseFromPublicId(video.public_id);

        return {
          sessionId: video.asset_id,
          name: parsed.name,
          substance: parsed.substance,
          stage: "Recovery",
          ageRange: parsed.ageRange,
          sex: parsed.sex,
          location: parsed.location,
          createdAt: video.created_at,
          answerCount: 1,
          firstVideo: video.secure_url,
          answers: {
            0: video.secure_url,
          },
        };
      }) || [];

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load stories",
      },
      { status: 500 }
    );
  }
}