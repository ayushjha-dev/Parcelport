import { NextResponse } from 'next/server';
import { getFirestore, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

// Initialize Firebase if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export async function POST(request: Request) {
  try {
    const { parcel_id, delivery_boy_id } = await request.json();

    if (!parcel_id || !delivery_boy_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update parcel in Firestore
    const parcelRef = doc(db, 'parcels', parcel_id);
    await updateDoc(parcelRef, {
      delivery_boy_id,
      status: 'assigned',
      assigned_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Parcel assigned successfully',
      parcel_id,
      delivery_boy_id 
    });
  } catch (error) {
    console.error('Error assigning parcel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to assign parcel' },
      { status: 500 }
    );
  }
}
