import { NextResponse } from 'next/server';
import { getFirestore, collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
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

export async function GET() {
  try {
    const deliveryBoysRef = collection(db, 'delivery_boys');
    const q = query(deliveryBoysRef, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    
    const deliveryBoys = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(deliveryBoys);
  } catch (error) {
    console.error('Error fetching delivery boys:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch delivery boys' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const deliveryBoysRef = collection(db, 'delivery_boys');
    const docRef = await addDoc(deliveryBoysRef, {
      ...body,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return NextResponse.json({
      id: docRef.id,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating delivery boy:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create delivery boy' },
      { status: 500 }
    );
  }
}
