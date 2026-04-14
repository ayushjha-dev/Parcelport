import { z } from 'zod';

export const paymentScreenshotSchema = z.object({
  parcel_id: z.string().uuid(),
  payment_method: z.enum(['upi', 'debit_card', 'credit_card', 'net_banking', 'cash']),
  transaction_id: z.string().min(1, 'Transaction ID is required'),
  payment_date: z.date(),
  screenshot: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP) or PDF'
  ),
});

export const courierChargeSchema = z.object({
  parcel_id: z.string().uuid(),
  charge_type: z.enum(['cod', 'unpaid_shipping', 'custom_duty', 'return_charge', 'other']),
  charge_amount: z.number().min(1).max(50000),
  pay_via_portal: z.boolean(),
  challan: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ).refine(
    (file) => !file || ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP) or PDF'
  ),
});

export const paymentVerificationSchema = z.object({
  payment_id: z.string().uuid(),
  status: z.enum(['verified', 'rejected']),
  admin_note: z.string().optional(),
  rejection_reason: z.string().optional(),
}).refine(
  (data) => {
    if (data.status === 'rejected') {
      return !!data.rejection_reason;
    }
    return true;
  },
  {
    message: 'Rejection reason is required when rejecting payment',
    path: ['rejection_reason'],
  }
);

export type PaymentScreenshotInput = z.infer<typeof paymentScreenshotSchema>;
export type CourierChargeInput = z.infer<typeof courierChargeSchema>;
export type PaymentVerificationInput = z.infer<typeof paymentVerificationSchema>;
