import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=livesoberaf/stories/community&max_results=20`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const text = await response.text();

  return NextResponse.json({
    success: response.ok,
    status: response.status,
    cloudName,
    apiKeyStart: apiKey?.slice(0, 4),
    apiKeyEnd: apiKey?.slice(-4),
    responseText: text,
  });
}