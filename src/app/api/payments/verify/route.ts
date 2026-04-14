import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      parcel_id,
    } = await request.json();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        delivery_fee_status: 'verified',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }

    // Update parcel status
    if (payment && payment.parcel_id) {
      await supabase
        .from('parcels')
        .update({ status: 'payment_verified' })
        .eq('id', payment.parcel_id);
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment verification failed' },
      { status: 500 }
    );
  }
}
