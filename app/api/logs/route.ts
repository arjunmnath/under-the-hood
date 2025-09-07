import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { CreateLogRequest } from "@/types/log";

// Configure the route as dynamic since it uses request data
export const dynamic = "force-dynamic";

const levelMapping: Record<string, "info" | "warning" | "error" | "debug"> = {
  shout: "error",
  severe: "error",
  warning: "warning",
  info: "info",
  config: "info",
  fine: "debug",
  finer: "debug",
  finest: "debug",
};

export async function POST(request: NextRequest) {
  try {
    const body: CreateLogRequest = await request.json();
    body.level = body.level.toLowerCase() as CreateLogRequest["level"];
    const { userid, application, timestamp, logger, level, message, metadata } =
      body;

    // Validate required fields
    if (!userid || !application || !timestamp || !message) {
      return NextResponse.json(
        { error: "UserId, application, timestamp and message are required" },
        { status: 400 },
      );
    }

    if (!Object.keys(levelMapping).includes(level)) {
      return NextResponse.json(
        {
          error: `Invalid log level. Must be one of: ${Object.keys(levelMapping).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const mappedLevel = levelMapping[level];
    const logData = {
      ...body,
      level: mappedLevel,
      originalLevel: level, 
    };
    const docRef = await adminDb.collection("logs").add(logData);
    return NextResponse.json({
      success: true,
      message: "Log added successfully",
      logId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding log:", error);
    return NextResponse.json(
      {
        error: "Failed to add log",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "GET method not supported. Use POST to submit logs." },
    { status: 405 },
  );
}
