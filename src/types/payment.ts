import type { PaymentMethod, PaymentStatus } from './database';

export interface Payment {
  id: string;
  parcel_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  screenshot_url?: string;
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentInitiateRequest {
  parcel_id: string;
  amount: number;
  type: 'delivery_fee' | 'courier_charge';
}

export interface PaymentInitiateResponse {
  order_id: string;
  amount: number;
  currency: string;
}

export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  parcel_id: string;
  type: 'delivery_fee' | 'courier_charge';
}

export interface PaymentVerifyResponse {
  success: boolean;
  payment_id: string;
}
