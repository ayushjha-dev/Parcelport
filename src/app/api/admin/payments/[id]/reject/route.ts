import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['admin']);
    const { id } = await params;
    const { reason } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('parcel_id')
      .eq('id', id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update payment status
    await supabase
      .from('payments')
      .update({
        delivery_fee_status: 'rejected',
        rejection_reason: reason || 'Rejected by admin',
      })
      .eq('id', id);

    // Update parcel status
    if (payment.parcel_id) {
      await supabase
        .from('parcels')
        .update({ status: 'payment_pending', rejected_reason: reason })
        .eq('id', payment.parcel_id);
    }

    return NextResponse.json({ success: true, payment_id: id, rejected: true });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reject payment' },
      { status: 500 }
    );
  }
}
