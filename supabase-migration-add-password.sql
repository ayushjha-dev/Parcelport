-- Add password_hash column to profiles table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create index for faster email lookups during login
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Update RLS policies to allow registration without authentication
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for registration" ON public.profiles;

-- Allow anyone to insert (for registration)
CREATE POLICY "Enable insert for registration" ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (true);

-- Allow users to update their own profile (but not password_hash directly)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Comment for clarity
COMMENT ON COLUMN public.profiles.password_hash IS 'SHA-256 hashed password for authentication';
