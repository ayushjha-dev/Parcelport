import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import { errorResponse, successResponse, db, parseBody } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    // Note: In a real app, you'd verify the JWT token from the request
    // For now, this returns public notifications
    
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      orderBy('created_at', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return successResponse(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to fetch notifications');
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await parseBody(request);

    if (!id) {
      return errorResponse('Missing notification ID', 400);
    }

    const notificationRef = doc(db, 'notifications', id);
    await updateDoc(notificationRef, { read: true });

    return successResponse({ success: true, id });
  } catch (error) {
    console.error('Error updating notification:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to update notification');
  }
}
