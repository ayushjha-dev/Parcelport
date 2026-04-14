import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { errorResponse, successResponse, db, parseBody, Timestamp } from '@/lib/api-utils';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      parcel_id,
    } = await parseBody(request);

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return errorResponse('Payment signature verification failed', 400);
    }

    // Update payment record
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('razorpay_order_id', '==', razorpay_order_id));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      const paymentRef = snapshot.docs[0].ref;
      await updateDoc(paymentRef, {
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        verified_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });

      // Update parcel status if available
      if (parcel_id) {
        const parcelsRef = collection(db, 'parcels');
        const pq = query(parcelsRef, where('id', '==', parcel_id));
        const pSnapshot = await getDocs(pq);
        if (pSnapshot.docs.length > 0) {
          await updateDoc(pSnapshot.docs[0].ref, {
            status: 'payment_verified',
            updated_at: Timestamp.now()
          });
        }
      }
    }

    return successResponse({ verified: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return errorResponse(error instanceof Error ? error.message : 'Payment verification failed');
  }
}
