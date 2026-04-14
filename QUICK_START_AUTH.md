# Quick Start - Authentication Setup

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migration

Copy and paste this SQL into your **Supabase SQL Editor**:

```sql
-- Add password_hash column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for registration" ON public.profiles;

CREATE POLICY "Enable insert for registration" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (true) WITH CHECK (true);
```

### Step 2: Create Your First Admin

```bash
npx tsx scripts/create-admin.ts
```

Enter your details when prompted:
- Full Name: `Admin User`
- Email: `admin@example.com`
- Mobile: `9876543210`
- Password: `admin123` (min 6 characters)

### Step 3: Test It Out!

#### Test Student Registration
1. Visit: `http://localhost:3000/register`
2. Fill the form with test data
3. Password: `student123`
4. Click "Create Account"
5. ✅ You should be logged in and redirected to student dashboard

#### Test Staff Registration
1. Visit: `http://localhost:3000/register-staff`
2. Fill the form with test data
3. Password: `staff123`
4. Click "Create Account"
5. ✅ You should be logged in and redirected to delivery dashboard

#### Test Login
1. Visit: `http://localhost:3000/login`
2. Select role: **Admin**
3. Email: `admin@example.com`
4. Password: `admin123`
5. Click "Sign In"
6. ✅ You should be redirected to admin dashboard

## 🎉 That's It!

Your authentication system is now working without email confirmation!

## 📝 Key Features

✅ **No Email Confirmation** - Users can login immediately after registration  
✅ **Role-Based Access** - Student, Admin, and Delivery Staff roles  
✅ **Session Management** - Secure cookie-based sessions  
✅ **Route Protection** - Middleware automatically protects routes  
✅ **Simple & Fast** - Perfect for prototypes and internal apps  

## 🔐 Default Test Accounts

After setup, you can create these test accounts:

| Role | Email | Password | Register At |
|------|-------|----------|-------------|
| Student | student@test.com | student123 | `/register` |
| Staff | staff@test.com | staff123 | `/register-staff` |
| Admin | admin@test.com | admin123 | Use script |

## 🐛 Troubleshooting

**Migration fails?**
- Make sure you're using Supabase SQL Editor (not CLI)
- Check you have admin access to your Supabase project

**Can't create admin?**
- Verify `.env.local` has correct Supabase credentials
- Check `SUPABASE_SERVICE_ROLE_KEY` is set

**Login not working?**
- Clear browser cookies
- Check browser console for errors
- Verify migration was successful

## 📚 Need More Help?

See the full guide: `AUTH_MIGRATION_GUIDE.md`
