import { z } from 'zod';

// Step 1: Student Details
export const parcelStep1Schema = z.object({
  full_name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(80, 'Name must not exceed 80 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  mobile_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid mobile number. Must be 10 digits starting with 6-9'),
  email: z.string().email('Invalid email address'),
  student_roll_no: z.string().min(1, 'Roll number is required'),
  course_branch: z.string().min(1, 'Course/Branch is required'),
});

// Step 2: Hostel Details
export const parcelStep2Schema = z.object({
  hostel_block: z.string().min(1, 'Hostel block is required'),
  floor_number: z.string().min(1, 'Floor number is required'),
  room_number: z
    .string()
    .min(1, 'Room number is required')
    .max(10, 'Room number must not exceed 10 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Room number must be alphanumeric'),
  landmark_note: z.string().optional(),
});

// Step 3: Parcel Details
export const parcelStep3Schema = z.object({
  parcel_awb: z
    .string()
    .min(6, 'AWB must be at least 6 characters')
    .max(30, 'AWB must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'AWB must be alphanumeric'),
  courier_company: z.enum([
    'amazon',
    'flipkart',
    'dtdc',
    'bluedart',
    'delhivery',
    'ekart',
    'speed_post',
    'other',
  ]),
  parcel_description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must not exceed 100 characters'),
  weight_range: z.enum(['under_1kg', '1_to_5kg', '5_to_10kg', 'over_10kg']).optional(),
  expected_date: z.date().optional(),
  preferred_time_slot: z.enum(['morning', 'afternoon', 'evening']),
  is_fragile: z.boolean().default(false),
});

// Step 4: Payment Details
export const parcelStep4Schema = z.object({
  delivery_fee_paid: z.boolean(),
  delivery_fee_method: z.enum(['upi', 'debit_card', 'credit_card', 'net_banking', 'cash']).optional(),
  delivery_fee_transaction_id: z.string().optional(),
  delivery_fee_payment_date: z.date().optional(),
  delivery_fee_screenshot: z.instanceof(File).optional(),
  has_courier_charge: z.boolean(),
  courier_charge_type: z.enum(['cod', 'unpaid_shipping', 'custom_duty', 'return_charge', 'other']).optional(),
  courier_charge_amount: z
    .number()
    .min(1, 'Amount must be at least ₹1')
    .max(50000, 'Amount must not exceed ₹50,000')
    .optional(),
  courier_pay_via_portal: z.boolean().optional(),
  courier_challan: z.instanceof(File).optional(),
}).refine(
  (data) => {
    if (data.delivery_fee_paid) {
      return data.delivery_fee_method && data.delivery_fee_transaction_id;
    }
    return true;
  },
  {
    message: 'Payment method and transaction ID are required when payment is made',
    path: ['delivery_fee_method'],
  }
).refine(
  (data) => {
    if (data.has_courier_charge) {
      return data.courier_charge_type && data.courier_charge_amount;
    }
    return true;
  },
  {
    message: 'Charge type and amount are required when courier charge exists',
    path: ['courier_charge_type'],
  }
);

// Complete parcel form
export const parcelFormSchema = parcelStep1Schema
  .merge(parcelStep2Schema)
  .merge(parcelStep3Schema)
  .merge(parcelStep4Schema);

export type ParcelStep1Input = z.infer<typeof parcelStep1Schema>;
export type ParcelStep2Input = z.infer<typeof parcelStep2Schema>;
export type ParcelStep3Input = z.infer<typeof parcelStep3Schema>;
export type ParcelStep4Input = z.infer<typeof parcelStep4Schema>;
export type ParcelFormInput = z.infer<typeof parcelFormSchema>;
