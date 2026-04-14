-- Complete Database Fix for ParcelPort Authentication
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Ensure password_hash column exists
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE profiles ADD COLUMN password_hash TEXT;
  END IF;
END $$;

-- ============================================
-- STEP 2: Remove foreign key to auth.users
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;

-- ============================================
-- STEP 3: Ensure is_active column exists
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================
-- STEP 4: Drop all existing RLS policies
-- ============================================
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow public read access" ON profiles;
DROP POLICY IF EXISTS "Allow public insert" ON profiles;
DROP POLICY IF EXISTS "Allow public update" ON profiles;
DROP POLICY IF EXISTS "Allow service role full access" ON profiles;

-- ============================================
-- STEP 5: Enable RLS on profiles table
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: Create permissive RLS policies
-- ============================================

-- Allow anonymous users to read profiles (for login)
CREATE POLICY "Allow anonymous read for login"
ON profiles FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to insert profiles (for registration)
CREATE POLICY "Allow anonymous insert for registration"
ON profiles FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to update profiles (for profile updates via session)
CREATE POLICY "Allow anonymous update for authenticated sessions"
ON profiles FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow authenticated users to read all profiles
CREATE POLICY "Allow authenticated read"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update profiles
CREATE POLICY "Allow authenticated update"
ON profiles FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- STEP 7: Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_student_roll_no ON profiles(student_roll_no);

-- ============================================
-- STEP 8: Verify admin account exists
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM profiles 
    WHERE email = 'sanataniayushjha07@gmail.com'
  ) INTO admin_exists;
  
  IF NOT admin_exists THEN
    -- Create admin account
    INSERT INTO profiles (
      id,
      email,
      full_name,
      role,
      mobile_number,
      password_hash,
      is_active,
      mobile_verified,
      created_at,
      updated_at
    ) VALUES (
      'aaec3fc5-f26d-4f49-856b-dc9df25dce4c',
      'sanataniayushjha07@gmail.com',
      'Ayush Jha',
      'admin',
      '+918092137404',
      '8a8de823d5ed3e12746a62ef169bcf372be0ca44f0a1236abc35df05d96928e1',
      true,
      true,
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Admin account created successfully';
  ELSE
    -- Update existing admin account
    UPDATE profiles 
    SET 
      password_hash = '8a8de823d5ed3e12746a62ef169bcf372be0ca44f0a1236abc35df05d96928e1',
      is_active = true,
      role = 'admin',
      updated_at = NOW()
    WHERE email = 'sanataniayushjha07@gmail.com';
    RAISE NOTICE 'Admin account updated successfully';
  END IF;
END $$;

-- ============================================
-- STEP 9: Verify the setup
-- ============================================
SELECT 
  id,
  email,
  full_name,
  role,
  mobile_number,
  CASE 
    WHEN password_hash IS NOT NULL THEN 'SET' 
    ELSE 'NOT SET' 
  END as password_status,
  is_active,
  created_at
FROM profiles
WHERE email = 'sanataniayushjha07@gmail.com';

-- ============================================
-- STEP 10: Test query that login API uses
-- ============================================
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  mobile_number, 
  password_hash, 
  is_active
FROM profiles
WHERE email = 'sanataniayushjha07@gmail.com';

-- Success message
SELECT 'Database setup complete! Admin credentials: sanataniayushjha07@gmail.com / Admin@123' as message;
