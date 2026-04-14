import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const { amount, currency = 'INR', receipt } = await request.json();

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    });

    return NextResponse.json(order);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
