import { z } from 'zod';

export const deliveryOTPSchema = z.object({
  otp_code: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const deliveryIssueSchema = z.object({
  parcel_id: z.string().uuid(),
  failure_type: z.enum([
    'student_not_available',
    'wrong_room',
    'parcel_not_at_gate',
    'student_refused',
    'other',
  ]),
  failure_note: z.string().min(10, 'Please provide details (at least 10 characters)').max(500),
  failure_photo: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= 10 * 1024 * 1024,
    'File size must be less than 10MB'
  ).refine(
    (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP)'
  ),
});

export const deliveryCompleteSchema = z.object({
  parcel_id: z.string().uuid(),
  otp_code: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  delivery_photo: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= 10 * 1024 * 1024,
    'File size must be less than 10MB'
  ).refine(
    (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP)'
  ),
});

export const assignDeliveryBoySchema = z.object({
  parcel_id: z.string().uuid(),
  delivery_boy_id: z.string().uuid(),
});

export type DeliveryOTPInput = z.infer<typeof deliveryOTPSchema>;
export type DeliveryIssueInput = z.infer<typeof deliveryIssueSchema>;
export type DeliveryCompleteInput = z.infer<typeof deliveryCompleteSchema>;
export type AssignDeliveryBoyInput = z.infer<typeof assignDeliveryBoySchema>;
