import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { errorResponse, successResponse, db, Timestamp } from '@/lib/api-utils';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const { drid } = await params;

    if (!drid) {
      return errorResponse('Missing DRID', 400);
    }

    // Find parcel by DRID
    const parcelsRef = collection(db, 'parcels');
    const q = query(parcelsRef, where('drid', '==', drid));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0) {
      return errorResponse('Parcel not found', 404);
    }

    const parcelRef = doc(db, 'parcels', snapshot.docs[0].id);
    await updateDoc(parcelRef, {
      status: 'picked_up',
      picked_up_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    return successResponse({ 
      success: true, 
      message: 'Parcel picked up successfully',
      drid 
    });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to update status');
  }
}
