import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs, addDoc, Query, QueryConstraint } from 'firebase/firestore';
import { generateOTP } from '@/lib/utils/otp';
import { format } from 'date-fns';
import { errorResponse, successResponse, db, parseBody, Timestamp } from '@/lib/api-utils';

function generateUniqueDRID(): string {
  const datePart = format(new Date(), 'yyyyMMdd');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DRID-${datePart}-${randomPart}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    const parcelsRef = collection(db, 'parcels');
    const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];

    if (studentId) {
      constraints.push(where('student_id', '==', studentId));
    }

    if (status) {
      constraints.push(where('status', '==', status));
    }

    const q = query(parcelsRef, ...constraints);
    const snapshot = await getDocs(q);

    const parcels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return successResponse(parcels);
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to fetch parcels');
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);

    const drid = generateUniqueDRID();
    const otp = generateOTP();

    const parcelsRef = collection(db, 'parcels');
    const docRef = await addDoc(parcelsRef, {
      ...body,
      drid,
      otp,
      status: 'pending_payment',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return successResponse({
      id: docRef.id,
      ...body,
      drid,
      otp,
      status: 'pending_payment'
    });
  } catch (error) {
    console.error('Error creating parcel:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to create parcel');
  }
}
