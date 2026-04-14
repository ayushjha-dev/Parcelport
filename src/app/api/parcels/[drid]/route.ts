import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { errorResponse, successResponse, db, parseBody, Timestamp } from '@/lib/api-utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const { drid } = await params;

    if (!drid) {
      return errorResponse('Missing DRID', 400);
    }

    const parcelsRef = collection(db, 'parcels');
    const q = query(parcelsRef, where('drid', '==', drid));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0) {
      return errorResponse('Parcel not found', 404);
    }

    const parcel = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    return successResponse(parcel);
  } catch (error) {
    console.error('Error fetching parcel:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to fetch parcel');
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const { drid } = await params;
    const body = await parseBody(request);

    if (!drid) {
      return errorResponse('Missing DRID', 400);
    }

    const parcelsRef = collection(db, 'parcels');
    const q = query(parcelsRef, where('drid', '==', drid));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0) {
      return errorResponse('Parcel not found', 404);
    }

    const parcelRef = doc(db, 'parcels', snapshot.docs[0].id);
    await updateDoc(parcelRef, {
      ...body,
      updated_at: Timestamp.now()
    });

    return successResponse({ success: true, drid });
  } catch (error) {
    console.error('Error updating parcel:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to update parcel');
  }
}
