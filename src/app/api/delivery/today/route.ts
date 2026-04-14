import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { errorResponse, successResponse, db } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    // Note: In a real app, you'd verify the JWT token from the request
    // to get the delivery_boy_id securely
    
    const { searchParams } = new URL(request.url);
    const delivery_boy_id = searchParams.get('delivery_boy_id');
    
    if (!delivery_boy_id) {
      return errorResponse('Missing delivery_boy_id parameter', 400);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const parcelsRef = collection(db, 'parcels');
    const q = query(
      parcelsRef,
      where('delivery_boy_id', '==', delivery_boy_id),
      where('scheduled_date', '>=', Timestamp.fromDate(today)),
      where('scheduled_date', '<', Timestamp.fromDate(tomorrow)),
      orderBy('scheduled_date', 'asc')
    );

    const snapshot = await getDocs(q);
    const parcels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return successResponse(parcels);
  } catch (error) {
    console.error('Error fetching today parcels:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to fetch parcels');
  }
}
