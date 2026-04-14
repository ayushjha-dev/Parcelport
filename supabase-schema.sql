-- ParcelPort Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('student', 'admin', 'delivery_boy');
CREATE TYPE parcel_status AS ENUM (
  'submitted',
  'payment_pending',
  'payment_verified',
  'assigned',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
  'cancelled',
  'rejected'
);
CREATE TYPE payment_method AS ENUM ('upi', 'debit_card', 'credit_card', 'net_banking', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'rejected', 'refunded');
CREATE TYPE charge_type AS ENUM ('cod', 'unpaid_shipping', 'custom_duty', 'return_charge', 'other');
CREATE TYPE courier_company AS ENUM ('amazon', 'flipkart', 'dtdc', 'bluedart', 'delhivery', 'ekart', 'speed_post', 'other');
CREATE TYPE weight_range AS ENUM ('under_1kg', '1_to_5kg', '5_to_10kg', 'over_10kg');
CREATE TYPE time_slot AS ENUM ('morning', 'afternoon', 'evening');
CREATE TYPE delivery_issue_type AS ENUM ('student_not_available', 'wrong_room', 'parcel_not_at_gate', 'student_refused', 'other');

-- Create profiles table (combines users and students)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  mobile_verified BOOLEAN DEFAULT FALSE,
  email TEXT NOT NULL UNIQUE,
  student_roll_no TEXT,
  course_branch TEXT,
  hostel_block TEXT,
  floor_number TEXT,
  room_number TEXT,
  landmark_note TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery_boys table
CREATE TABLE delivery_boys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  campus_zone TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create parcels table
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drid TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_roll_no TEXT NOT NULL,
  student_mobile TEXT NOT NULL,
  student_email TEXT NOT NULL,
  hostel_block TEXT NOT NULL,
  floor_number TEXT NOT NULL,
  room_number TEXT NOT NULL,
  landmark_note TEXT,
  parcel_awb TEXT NOT NULL,
  courier_company courier_company NOT NULL,
  parcel_description TEXT NOT NULL,
  weight_range weight_range,
  expected_date DATE,
  preferred_time_slot time_slot NOT NULL,
  is_fragile BOOLEAN DEFAULT FALSE,
  status parcel_status DEFAULT 'submitted',
  admin_note TEXT,
  rejected_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  out_for_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  delivery_fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
  delivery_fee_method payment_method,
  delivery_fee_transaction_id TEXT,
  delivery_fee_payment_date TIMESTAMPTZ,
  delivery_fee_screenshot_url TEXT,
  delivery_fee_status payment_status DEFAULT 'pending',
  delivery_fee_verified_at TIMESTAMPTZ,
  delivery_fee_verified_by UUID REFERENCES profiles(id),
  has_courier_charge BOOLEAN DEFAULT FALSE,
  courier_charge_type charge_type,
  courier_charge_amount NUMERIC(10, 2),
  courier_pay_via_portal BOOLEAN,
  courier_challan_url TEXT,
  courier_payment_status payment_status,
  courier_razorpay_order_id TEXT,
  courier_razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  admin_note TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery_assignments table
CREATE TABLE delivery_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  delivery_boy_id UUID NOT NULL REFERENCES delivery_boys(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  otp_code TEXT,
  otp_generated_at TIMESTAMPTZ,
  otp_expires_at TIMESTAMPTZ,
  otp_verified_at TIMESTAMPTZ,
  picked_from_gate_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  delivery_photo_url TEXT,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,
  failure_type delivery_issue_type,
  failure_note TEXT,
  failure_photo_url TEXT,
  attempted_at TIMESTAMPTZ,
  is_redelivery BOOLEAN DEFAULT FALSE,
  redelivery_charge NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('delivery', 'payment', 'system', 'alert')),
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_status parcel_status,
  new_status parcel_status,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_student_roll_no ON profiles(student_roll_no);

CREATE INDEX idx_delivery_boys_is_active ON delivery_boys(is_active);
CREATE INDEX idx_delivery_boys_profile_id ON delivery_boys(profile_id);

CREATE INDEX idx_parcels_drid ON parcels(drid);
CREATE INDEX idx_parcels_student_id ON parcels(student_id);
CREATE INDEX idx_parcels_status ON parcels(status);
CREATE INDEX idx_parcels_created_at ON parcels(created_at DESC);
CREATE INDEX idx_parcels_student_status ON parcels(student_id, status);

CREATE INDEX idx_payments_parcel_id ON payments(parcel_id);
CREATE INDEX idx_payments_delivery_fee_status ON payments(delivery_fee_status);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);

CREATE INDEX idx_delivery_assignments_parcel_id ON delivery_assignments(parcel_id);
CREATE INDEX idx_delivery_assignments_delivery_boy_id ON delivery_assignments(delivery_boy_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_audit_logs_parcel_id ON audit_logs(parcel_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_delivery_boys_updated_at
  BEFORE UPDATE ON delivery_boys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_parcels_updated_at
  BEFORE UPDATE ON parcels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_delivery_assignments_updated_at
  BEFORE UPDATE ON delivery_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to generate DRID
CREATE OR REPLACE FUNCTION generate_drid()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  sequence_num INTEGER;
  new_drid TEXT;
BEGIN
  date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the count of parcels created today
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM parcels
  WHERE drid LIKE 'DRID-' || date_part || '-%';
  
  -- Format: DRID-YYYYMMDD-XXXX
  new_drid := 'DRID-' || date_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_drid;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate OTP
CREATE OR REPLACE FUNCTION generate_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_boys ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for delivery_boys
CREATE POLICY "Admins can manage delivery boys"
  ON delivery_boys FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Delivery boys can view their own record"
  ON delivery_boys FOR SELECT
  USING (profile_id = auth.uid());

-- RLS Policies for parcels
CREATE POLICY "Students can view their own parcels"
  ON parcels FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can create parcels"
  ON parcels FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can view all parcels"
  ON parcels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all parcels"
  ON parcels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Delivery boys can view assigned parcels"
  ON parcels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM delivery_assignments da
      JOIN delivery_boys db ON da.delivery_boy_id = db.id
      WHERE da.parcel_id = parcels.id
        AND db.profile_id = auth.uid()
    )
  );

CREATE POLICY "Delivery boys can update assigned parcels"
  ON parcels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM delivery_assignments da
      JOIN delivery_boys db ON da.delivery_boy_id = db.id
      WHERE da.parcel_id = parcels.id
        AND db.profile_id = auth.uid()
    )
  );

-- RLS Policies for payments
CREATE POLICY "Students can view their own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parcels
      WHERE parcels.id = payments.parcel_id
        AND parcels.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can create payments"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parcels
      WHERE parcels.id = payments.parcel_id
        AND parcels.student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for delivery_assignments
CREATE POLICY "Admins can manage delivery assignments"
  ON delivery_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Delivery boys can view their assignments"
  ON delivery_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM delivery_boys
      WHERE delivery_boys.id = delivery_assignments.delivery_boy_id
        AND delivery_boys.profile_id = auth.uid()
    )
  );

CREATE POLICY "Delivery boys can update their assignments"
  ON delivery_assignments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM delivery_boys
      WHERE delivery_boys.id = delivery_assignments.delivery_boy_id
        AND delivery_boys.profile_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
