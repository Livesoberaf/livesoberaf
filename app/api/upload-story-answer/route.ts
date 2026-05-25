import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = "nodejs";

const TOTAL_QUESTIONS = 20;

function safe(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    const sessionId = String(formData.get("sessionId") || "");
    const questionIndex = Number(formData.get("questionIndex"));

    const name = String(formData.get("name") || "anonymous");
    const substance = String(formData.get("substance") || "recovery");
    const stage = String(formData.get("stage") || "");
    const ageRange = String(formData.get("ageRange") || "");
    const sex = String(formData.get("sex") || "");
    const location = String(formData.get("location") || "");
    const consent =
      String(formData.get("consent") || "false") === "true";

    if (!file || !sessionId || Number.isNaN(questionIndex)) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicId = `${safe(name)}-${safe(substance)}-${safe(
      location || "unknown"
    )}-${safe(ageRange || "age")}-${safe(
      sex || "sex"
    )}-${sessionId}-q${questionIndex + 1}`;

    const uploadResult = await uploadBufferToCloudinary(buffer, {
      resource_type: "video",
      folder: "livesoberaf/stories/community",
      public_id: publicId,
      overwrite: true,

      context: {
        sessionId: String(sessionId),
        name: String(name),
        substance: String(substance),
        stage: String(stage),
        ageRange: String(ageRange),
        sex: String(sex),
        location: String(location),
        consent: String(consent),
        questionIndex: String(questionIndex),
        questionNumber: String(questionIndex + 1),
        source: "community",
      },
    });

    return NextResponse.json({
      success: true,
      videoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      answerCount: questionIndex + 1,
      isPublished:
        consent && questionIndex + 1 >= TOTAL_QUESTIONS,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to upload story answer." },
      { status: 500 }
    );
  }
}