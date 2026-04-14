// Database types matching Supabase schema

export type UserRole = 'student' | 'admin' | 'delivery_boy';

export type ParcelStatus =
  | 'submitted'
  | 'payment_pending'
  | 'payment_verified'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'cancelled'
  | 'rejected';

export type PaymentMethod =
  | 'upi'
  | 'debit_card'
  | 'credit_card'
  | 'net_banking'
  | 'cash';

export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'refunded';

export type ChargeType =
  | 'cod'
  | 'unpaid_shipping'
  | 'custom_duty'
  | 'return_charge'
  | 'other';

export type CourierCompany =
  | 'amazon'
  | 'flipkart'
  | 'dtdc'
  | 'bluedart'
  | 'delhivery'
  | 'ekart'
  | 'speed_post'
  | 'other';

export type WeightRange =
  | 'under_1kg'
  | '1_to_5kg'
  | '5_to_10kg'
  | 'over_10kg';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export type DeliveryIssueType =
  | 'student_not_available'
  | 'wrong_room'
  | 'parcel_not_at_gate'
  | 'student_refused'
  | 'other';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  mobile_number: string;
  mobile_verified: boolean;
  email: string;
  student_roll_no: string | null;
  course_branch: string | null;
  hostel_block: string | null;
  floor_number: string | null;
  room_number: string | null;
  landmark_note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryBoy {
  id: string;
  profile_id: string | null;
  name: string;
  mobile: string;
  is_active: boolean;
  campus_zone: string | null;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface Parcel {
  id: string;
  drid: string;
  student_id: string;
  student_name: string;
  student_roll_no: string;
  student_mobile: string;
  student_email: string;
  hostel_block: string;
  floor_number: string;
  room_number: string;
  landmark_note: string | null;
  parcel_awb: string;
  courier_company: CourierCompany;
  parcel_description: string;
  weight_range: WeightRange | null;
  expected_date: string | null;
  preferred_time_slot: TimeSlot;
  is_fragile: boolean;
  status: ParcelStatus;
  admin_note: string | null;
  rejected_reason: string | null;
  submitted_at: string;
  approved_at: string | null;
  assigned_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  parcel_id: string;
  delivery_fee_amount: number;
  delivery_fee_method: PaymentMethod | null;
  delivery_fee_transaction_id: string | null;
  delivery_fee_payment_date: string | null;
  delivery_fee_screenshot_url: string | null;
  delivery_fee_status: PaymentStatus;
  delivery_fee_verified_at: string | null;
  delivery_fee_verified_by: string | null;
  has_courier_charge: boolean;
  courier_charge_type: ChargeType | null;
  courier_charge_amount: number | null;
  courier_pay_via_portal: boolean | null;
  courier_challan_url: string | null;
  courier_payment_status: PaymentStatus | null;
  courier_razorpay_order_id: string | null;
  courier_razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  admin_note: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAssignment {
  id: string;
  parcel_id: string;
  delivery_boy_id: string;
  assigned_by: string | null;
  otp_code: string | null;
  otp_generated_at: string | null;
  otp_expires_at: string | null;
  otp_verified_at: string | null;
  picked_from_gate_at: string | null;
  delivered_at: string | null;
  delivery_photo_url: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  failure_type: DeliveryIssueType | null;
  failure_note: string | null;
  failure_photo_url: string | null;
  attempted_at: string | null;
  is_redelivery: boolean;
  redelivery_charge: number | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  parcel_id: string | null;
  title: string;
  message: string;
  type: 'delivery' | 'payment' | 'system' | 'alert';
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  parcel_id: string | null;
  actor_id: string | null;
  action: string;
  old_status: ParcelStatus | null;
  new_status: ParcelStatus | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Supabase Database type for type-safe queries
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      delivery_boys: {
        Row: DeliveryBoy;
        Insert: Partial<DeliveryBoy>;
        Update: Partial<DeliveryBoy>;
      };
      parcels: {
        Row: Parcel;
        Insert: Partial<Parcel>;
        Update: Partial<Parcel>;
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment>;
        Update: Partial<Payment>;
      };
      delivery_assignments: {
        Row: DeliveryAssignment;
        Insert: Partial<DeliveryAssignment>;
        Update: Partial<DeliveryAssignment>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Partial<AuditLog>;
        Update: Partial<AuditLog>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      parcel_status: ParcelStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      charge_type: ChargeType;
      courier_company: CourierCompany;
      weight_range: WeightRange;
      time_slot: TimeSlot;
      delivery_issue_type: DeliveryIssueType;
    };
  };
};
