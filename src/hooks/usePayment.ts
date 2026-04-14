import { useMutation } from '@tanstack/react-query';

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  theme: { color: string };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export function usePayment() {

  const initiatePayment = useMutation({
    mutationFn: async ({ amount, receipt }: { amount: number; receipt: string }) => {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt }),
      });
      if (!res.ok) throw new Error('Failed to initiate payment');
      return res.json();
    },
  });

  const verifyPayment = useMutation({
    mutationFn: async (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      parcel_id: string;
    }) => {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to verify payment');
      return res.json();
    },
  });

  const openRazorpay = (
    orderId: string,
    amount: number,
    parcelId: string,
    onSuccess?: () => void
  ) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'ParcelPort',
      description: 'Parcel Delivery Fee',
      order_id: orderId,
      handler: async (response: RazorpayResponse) => {
        try {
          await verifyPayment.mutateAsync({
            ...response,
            parcel_id: parcelId,
          });
          onSuccess?.();
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      },
      theme: {
        color: '#04122e',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return {
    initiatePayment,
    verifyPayment,
    openRazorpay,
  };
}
