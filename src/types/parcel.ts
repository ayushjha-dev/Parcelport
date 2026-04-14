import type { CourierCompany, WeightRange, TimeSlot, PaymentMethod, ChargeType } from './database';

export interface ParcelFormData {
  // Step 1 - Student Details
  full_name: string;
  mobile_number: string;
  email: string;
  student_roll_no: string;
  course_branch: string;
  
  // Step 2 - Hostel Details
  hostel_block: string;
  floor_number: string;
  room_number: string;
  landmark_note?: string;
  
  // Step 3 - Parcel Details
  parcel_awb: string;
  courier_company: CourierCompany;
  parcel_description: string;
  weight_range?: WeightRange;
  expected_date?: Date;
  preferred_time_slot: TimeSlot;
  is_fragile: boolean;
  
  // Step 4 - Payment Details
  delivery_fee_paid: boolean;
  delivery_fee_method?: PaymentMethod;
  delivery_fee_transaction_id?: string;
  delivery_fee_payment_date?: Date;
  delivery_fee_screenshot?: File;
  has_courier_charge: boolean;
  courier_charge_type?: ChargeType;
  courier_charge_amount?: number;
  courier_pay_via_portal?: boolean;
  courier_challan?: File;
}

export interface ParcelFormStep1 {
  full_name: string;
  mobile_number: string;
  email: string;
  student_roll_no: string;
  course_branch: string;
}

export interface ParcelFormStep2 {
  hostel_block: string;
  floor_number: string;
  room_number: string;
  landmark_note?: string;
}

export interface ParcelFormStep3 {
  parcel_awb: string;
  courier_company: CourierCompany;
  parcel_description: string;
  weight_range?: WeightRange;
  expected_date?: Date;
  preferred_time_slot: TimeSlot;
  is_fragile: boolean;
}

export interface ParcelFormStep4 {
  delivery_fee_paid: boolean;
  delivery_fee_method?: PaymentMethod;
  delivery_fee_transaction_id?: string;
  delivery_fee_payment_date?: Date;
  delivery_fee_screenshot?: File;
  has_courier_charge: boolean;
  courier_charge_type?: ChargeType;
  courier_charge_amount?: number;
  courier_pay_via_portal?: boolean;
  courier_challan?: File;
}
