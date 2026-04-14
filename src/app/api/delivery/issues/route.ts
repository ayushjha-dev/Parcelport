import { NextResponse } from 'next/server';
import { collection, addDoc, updateDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { errorResponse, successResponse, db, parseBody, Timestamp } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const { drid, issue_type, description, reported_by_id } = body;

    if (!drid || !reported_by_id) {
      return errorResponse('Missing required fields', 400);
    }

    // Create issue record
    const issuesRef = collection(db, 'delivery_issues');
    const issueDoc = await addDoc(issuesRef, {
      drid,
      issue_type,
      description,
      reported_by_id,
      created_at: Timestamp.now(),
      status: 'open'
    });

    // Update parcel status
    const parcelsRef = collection(db, 'parcels');
    const q = query(parcelsRef, where('drid', '==', drid));
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length > 0) {
      const parcelRef = doc(db, 'parcels', snapshot.docs[0].id);
      await updateDoc(parcelRef, {
        status: 'issue_reported',
        updated_at: Timestamp.now()
      });
    }

    return successResponse({ id: issueDoc.id, drid, issue_type });
  } catch (error) {
    console.error('Error reporting delivery issue:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to report issue');
  }
}
