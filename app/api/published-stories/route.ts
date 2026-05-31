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
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/stories/community&max_results=12`,
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
      data.resources?.map((item: any) => {
        const info = parseFromPublicId(item.public_id);

        return {
          sessionId: item.asset_id,
          name: info.name,
          substance: info.substance,
          ageRange: info.ageRange,
          sex: info.sex,
          location: info.location,
          createdAt: item.created_at,
          answerCount: 1,
          firstVideo: item.secure_url,
          answers: {
            0: item.secure_url,
          },
        };
      }) || [];

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