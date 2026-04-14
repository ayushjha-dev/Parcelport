import { NextResponse } from 'next/server';
import { queryCollection, errorResponse, successResponse, Timestamp, db } from '@/lib/api-utils';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const parcelsRef = collection(db, 'parcels');
    const constraints: any[] = [orderBy('created_at', 'desc')];

    if (status && status !== 'all') {
      constraints.push(where('status', '==', status));
    }

    const q = query(parcelsRef, ...constraints, limit(100));
    const snapshot = await getDocs(q);
    
    const parcels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Record<string, any>[];

    // Apply search filter in memory if needed
    const filtered = search
      ? parcels.filter(p => 
          String(p.drid as string)?.toLowerCase().includes(search.toLowerCase()) ||
          String(p.student_name as string)?.toLowerCase().includes(search.toLowerCase())
        )
      : parcels;

    return successResponse(filtered);
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to fetch parcels');
  }
}
