import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const filePath = path.join(process.cwd(), "data", "registrations.json");

function readRegistrations(): { email: string; registeredAt: string }[] {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeRegistrations(
  data: { email: string; registeredAt: string }[]
) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const registrations = readRegistrations();

    const alreadyRegistered = registrations.some(
      (r) => r.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyRegistered) {
      return NextResponse.json({ success: true, alreadyRegistered: true });
    }

    registrations.push({
      email: email.toLowerCase().trim(),
      registeredAt: new Date().toISOString(),
    });

    writeRegistrations(registrations);

    return NextResponse.json({ success: true, alreadyRegistered: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Could not save registration." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const registrations = readRegistrations();
    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Could not read registrations." },
      { status: 500 }
    );
  }
}
