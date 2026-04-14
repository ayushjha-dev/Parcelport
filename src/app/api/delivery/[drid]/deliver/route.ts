import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { errorResponse, successResponse, db, parseBody, Timestamp } from '@/lib/api-utils';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const { drid } = await params;
    const { otp } = await parseBody(request);

    if (!drid || !otp) {
      return errorResponse('Missing DRID or OTP', 400);
    }

    // Find parcel by DRID
    const parcelsRef = collection(db, 'parcels');
    const q = query(parcelsRef, where('drid', '==', drid));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0) {
      return errorResponse('Parcel not found', 404);
    }

    const parcelDoc = snapshot.docs[0];
    const parcelData = parcelDoc.data();

    // Verify OTP
    if (parcelData.otp !== otp) {
      return errorResponse('Invalid OTP', 400);
    }

    // Update parcel status
    const parcelRef = doc(db, 'parcels', parcelDoc.id);
    await updateDoc(parcelRef, {
      status: 'delivered',
      delivered_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      otp_verified: true
    });

    return successResponse({ 
      success: true, 
      message: 'Parcel delivered successfully',
      drid 
    });
  } catch (error) {
    console.error('Error marking delivery:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to mark delivery');
  }
}
