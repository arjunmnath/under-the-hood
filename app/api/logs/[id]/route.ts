import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Log ID is required" },
        { status: 400 },
      );
    }

    // Delete the log document from Firestore
    await adminDb.collection("logs").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Log deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting log:", error);
    return NextResponse.json(
      {
        error: "Failed to delete log",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
