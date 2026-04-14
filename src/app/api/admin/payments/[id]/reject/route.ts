import { NextResponse } from 'next/server';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { errorResponse, successResponse, db, parseBody, Timestamp } from '@/lib/api-utils';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await parseBody(request);

    if (!id) {
      return errorResponse('Missing payment ID', 400);
    }

    // Update payment status
    const paymentRef = doc(db, 'payments', id);
    await updateDoc(paymentRef, {
      status: 'failed',
      rejection_reason: reason || 'Rejected by admin',
      rejected_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    // Get payment details to find associated parcel
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('parcel_id', '==', id));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      const paymentDoc = snapshot.docs[0].data();
      const parcelId = paymentDoc.parcel_id;

      // Update parcel status
      if (parcelId) {
        const parcelRef = doc(db, 'parcels', parcelId);
        await updateDoc(parcelRef, {
          status: 'payment_failed',
          updated_at: Timestamp.now()
        });
      }
    }

    return successResponse({ success: true, payment_id: id, rejected: true });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to reject payment');
  }
}
