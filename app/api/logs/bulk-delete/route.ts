import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { logIds } = body;

    if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
      return NextResponse.json(
        { error: 'Log IDs array is required' },
        { status: 400 }
      );
    }

    // Validate that we don't have too many IDs (Firestore batch limit is 500)
    if (logIds.length > 500) {
      return NextResponse.json(
        { error: 'Cannot delete more than 500 logs at once' },
        { status: 400 }
      );
    }

    // Create a batch to delete multiple documents
    const batch = adminDb.batch();
    
    logIds.forEach((logId: string) => {
      const logRef = adminDb.collection('logs').doc(logId);
      batch.delete(logRef);
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${logIds.length} logs`,
      deletedCount: logIds.length
    });

  } catch (error) {
    console.error('Error bulk deleting logs:', error);
    return NextResponse.json(
      { error: 'Failed to bulk delete logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
