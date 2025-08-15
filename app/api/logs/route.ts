import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { CreateLogRequest } from "@/types/log";

// Configure the route as dynamic since it uses request data
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: CreateLogRequest = await request.json();
    const { message, level, userId, metadata } = body;

    // Validate required fields
    if (!message || !level || !userId) {
      return NextResponse.json(
        { error: "Message, level, and userId are required" },
        { status: 400 },
      );
    }

    // Validate log level
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

    // Create log entry in Firestore
    const logData = {
      message,
      level,
      userId,
      timestamp: new Date(),
      metadata: metadata || null,
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
