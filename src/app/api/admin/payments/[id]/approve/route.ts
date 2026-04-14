import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(['admin']);
    const { id } = await params;

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
        delivery_fee_status: 'verified',
        delivery_fee_verified_at: new Date().toISOString(),
        delivery_fee_verified_by: session.id,
      })
      .eq('id', id);

    // Update parcel status
    if (payment.parcel_id) {
      await supabase
        .from('parcels')
        .update({ status: 'payment_verified', approved_at: new Date().toISOString() })
        .eq('id', payment.parcel_id);
    }

    return NextResponse.json({ success: true, payment_id: id });
  } catch (error) {
    console.error('Error approving payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to approve payment' },
      { status: 500 }
    );
  }
}
