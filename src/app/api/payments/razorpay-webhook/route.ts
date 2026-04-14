import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { errorResponse, successResponse, db, Timestamp } from '@/lib/api-utils';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return errorResponse('Missing webhook signature', 400);
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return errorResponse('Invalid webhook signature', 400);
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.id;
      
      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, where('razorpay_payment_id', '==', paymentId));
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        await updateDoc(snapshot.docs[0].ref, {
          status: 'completed',
          updated_at: Timestamp.now()
        });
      }
    }

    return successResponse({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return errorResponse(error instanceof Error ? error.message : 'Webhook processing failed');
  }
}
