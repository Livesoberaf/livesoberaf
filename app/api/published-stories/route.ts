import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing Cloudinary environment variables" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/stories/community&max_results=12`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = await response.json();

    const stories =
      data.resources?.map((item: any) => ({
        id: item.asset_id,
        url: item.secure_url,
        publicId: item.public_id,
        createdAt: item.created_at,
      })) || [];

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load stories",
      },
      { status: 500 }
    );
  }
}