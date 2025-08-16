import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { CreateLogRequest } from "@/types/log";

// Configure the route as dynamic since it uses request data
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: CreateLogRequest = await request.json();
    const { userid, application, timestamp, logger, level, message, metadata } =
      body;

    // Validate required fields
    if (!userid || !application || !timestamp || !message) {
      return NextResponse.json(
        { error: "UserId, application, timestamp and message are required" },
        { status: 400 },
      );
    }

    const validLevels = ["info", "warning", "error", "debug"];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        {
          error:
            "Invalid log level. Must be one of: info, warning, error, debug",
        },
        { status: 400 },
      );
    }
    const docRef = await adminDb.collection("logs").add(body);
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
