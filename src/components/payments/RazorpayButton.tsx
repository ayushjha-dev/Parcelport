'use client';

import { Button } from '@/components/ui/button';
import { usePayment } from '@/hooks/usePayment';
import { CreditCard } from 'lucide-react';

interface RazorpayButtonProps {
  amount: number;
  parcelId: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function RazorpayButton({
  amount,
  parcelId,
  onSuccess,
  disabled,
}: RazorpayButtonProps) {
  const { initiatePayment, openRazorpay } = usePayment();

  const handlePayment = async () => {
    try {
      const order = await initiatePayment.mutateAsync({
        amount,
        receipt: `parcel_${parcelId}`,
      });

      openRazorpay(order.id, amount, parcelId, onSuccess);
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || initiatePayment.isPending}
      className="w-full bg-[#04122e] hover:bg-[#04122e]/90"
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {initiatePayment.isPending ? 'Processing...' : `Pay ₹${amount}`}
    </Button>
  );
}
