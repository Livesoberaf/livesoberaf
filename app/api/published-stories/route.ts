import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Session = {
  sessionId?: string;
  name: string;
  substance: string;
  stage: string;
  consent: boolean;
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
  answers: Record<number, string>;
};

export async function GET() {
  try {
    const sessionsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "sessions"
    );

    let sessions: (Session & { fileId: string })[] = [];

    if (fs.existsSync(sessionsDir)) {
      const files = fs.readdirSync(sessionsDir);

      sessions = files
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = path.join(sessionsDir, file);
          const content = fs.readFileSync(filePath, "utf8");
          const parsed = JSON.parse(content) as Session;

          return {
            ...parsed,
            fileId: file.replace(".json", ""),
          };
        });
    }

    const publishedSessions = sessions
      .filter(
        (session) =>
          session.consent &&
          session.isPublished &&
          Object.keys(session.answers || {}).length >= 20
      )
      .sort((a, b) => {
        const aDate = a.updatedAt
          ? new Date(a.updatedAt).getTime()
          : 0;

        const bDate = b.updatedAt
          ? new Date(b.updatedAt).getTime()
          : 0;

        return bDate - aDate;
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