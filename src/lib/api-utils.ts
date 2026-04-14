/**
 * Common API utilities for Firebase-based endpoints
 * Provides Firestore query helpers and Firebase integration
 */

import { NextResponse } from 'next/server';
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  where, 
  limit,
  getDocs, 
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  Query,
  QueryConstraint
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Initialize Firebase
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

export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Helper to handle Firestore queries
 */
export async function queryCollection(
  collectionName: string,
  constraints: Array<QueryConstraint> = []
) {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}

/**
 * Helper to create error responses
 */
export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Helper to create success responses
 */
export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Parse request body safely
 */
export async function parseBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid request body');
  }
}

export { Timestamp };
