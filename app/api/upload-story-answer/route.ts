import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const TOTAL_QUESTIONS = 20;

type StoredSession = {
  sessionId: string;
  name: string;
  substance: string;
  stage: string;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  answers: Record<number, string>;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const sessionId = String(formData.get("sessionId") || "");
    const questionIndex = Number(formData.get("questionIndex"));
    const name = String(formData.get("name") || "");
    const substance = String(formData.get("substance") || "");
    const stage = String(formData.get("stage") || "");
    const consent = String(formData.get("consent") || "false") === "true";

    if (!file || !sessionId || Number.isNaN(questionIndex)) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "stories");
    const sessionsDir = path.join(process.cwd(), "public", "uploads", "sessions");

    await mkdir(uploadsDir, { recursive: true });
    await mkdir(sessionsDir, { recursive: true });

    const safe = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const safeName = safe(name || "story");
    const safeSubstance = safe(substance || "recovery");

    const extension =
      file.type.includes("mp4")
        ? "mp4"
        : file.type.includes("webm")
        ? "webm"
        : "webm";

    const fileName = `${safeName}-${safeSubstance}-${sessionId}-q${
      questionIndex + 1
    }.${extension}`;

    const filePath = path.join(uploadsDir, fileName);
    const publicUrl = `/uploads/stories/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const sessionPath = path.join(sessionsDir, `${sessionId}.json`);

    let session: StoredSession = {
      sessionId,
      name,
      substance,
      stage,
      consent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      answers: {},
    };

    try {
      const existing = await readFile(sessionPath, "utf8");
      session = JSON.parse(existing) as StoredSession;
    } catch {
      // first save
    }

    session.name = name;
    session.substance = substance;
    session.stage = stage;
    session.consent = consent;
    session.updatedAt = new Date().toISOString();
    session.answers[questionIndex] = publicUrl;

    const answerCount = Object.keys(session.answers).length;
    session.isPublished = consent && answerCount >= TOTAL_QUESTIONS;

    await writeFile(sessionPath, JSON.stringify(session, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      videoUrl: publicUrl,
      answerCount,
      isPublished: session.isPublished,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload story answer." },
      { status: 500 }
    );
  }
}