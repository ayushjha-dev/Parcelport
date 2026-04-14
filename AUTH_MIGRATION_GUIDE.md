# Authentication System Migration Guide

## Overview

The authentication system has been completely redesigned to use a **simple, table-based approach** instead of Supabase Auth. This eliminates the need for email confirmation and simplifies the entire authentication flow.

## What Changed

### Before (Supabase Auth)
- Required email confirmation
- Complex auth flow with multiple steps
- Dependent on Supabase Auth service
- Email verification required before login

### After (Table-Based Auth)
- Direct database authentication
- Simple password hashing (SHA-256)
- Session-based authentication using cookies
- No email confirmation required
- Immediate login after registration

## Setup Instructions

### 1. Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# The migration file is: supabase-migration-add-password.sql
```

This will:
- Add `password_hash` column to `profiles` table
- Create index for faster email lookups
- Update RLS policies for registration

### 2. Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Create First Admin User

Run the admin creation script:

```bash
npx tsx scripts/create-admin.ts
```

Follow the prompts to create your first admin account.

## How It Works

### Registration Flow

1. **Student Registration** (`/register`)
   - User fills out registration form
   - Password is hashed using SHA-256
   - Profile created in `profiles` table with `role='student'`
   - Session cookie created automatically
   - User redirected to `/student/dashboard`

2. **Staff Registration** (`/register-staff`)
   - Similar to student registration
   - Creates profile with `role='delivery_boy'`
   - Also creates entry in `delivery_boys` table
   - User redirected to `/delivery/dashboard`

3. **Admin Creation**
   - Use the `scripts/create-admin.ts` script
   - Or manually insert into database with `role='admin'`

### Login Flow

1. User enters email and password
2. System looks up user in `profiles` table by email
3. Password is hashed and compared with stored hash
4. If valid, session cookie is created
5. User redirected based on role:
   - `student` → `/student/dashboard`
   - `admin` → `/admin/dashboard`
   - `delivery_boy` → `/delivery/dashboard`

### Session Management

- Sessions stored in HTTP-only cookies
- Cookie name: `parcelport_session`
- Expires after 7 days
- Middleware protects routes automatically

## API Endpoints

### POST `/api/auth/register`
Register a new student account.

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "9876543210",
  "student_roll_no": "2024001",
  "course_branch": "btech-cse",
  "hostel_block": "a",
  "floor_number": "4",
  "room_number": "412",
  "landmark_note": "Near water cooler",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "student",
    "mobile_number": "+919876543210"
  }
}
```

### POST `/api/auth/register-staff`
Register a new delivery staff account.

**Request:**
```json
{
  "full_name": "Jane Smith",
  "email": "jane@example.com",
  "mobile_number": "9876543211",
  "password": "password123",
  "confirm_password": "password123"
}
```

### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "student",
    "mobile_number": "+919876543210"
  }
}
```

### GET `/api/auth/me`
Get current user session.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "student",
    "mobile_number": "+919876543210"
  }
}
```

### POST `/api/auth/logout`
Logout and destroy session.

**Response:**
```json
{
  "success": true
}
```

## Security Considerations

### Password Hashing
- Uses SHA-256 for password hashing
- For production, consider upgrading to bcrypt or argon2
- Current implementation is sufficient for prototype/demo

### Session Security
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- SameSite=Lax prevents CSRF
- 7-day expiration

### Database Security
- RLS policies control data access
- Service role key kept server-side only
- Password hashes never exposed to client

## Testing

### Test Student Registration
1. Go to `/register`
2. Fill out the form
3. Use password: `test123` (min 6 chars)
4. Should redirect to `/student/dashboard`

### Test Staff Registration
1. Go to `/register-staff`
2. Fill out the form
3. Use password: `test123`
4. Should redirect to `/delivery/dashboard`

### Test Login
1. Go to `/login`
2. Select role (Student/Admin/Staff)
3. Enter credentials
4. Should redirect to appropriate dashboard

### Test Admin Creation
```bash
npx tsx scripts/create-admin.ts
```

## Troubleshooting

### "Email already registered" error
- Email must be unique in the system
- Check if user already exists in `profiles` table

### "Invalid email or password" error
- Verify email is correct
- Password is case-sensitive
- Ensure role matches the account type

### Session not persisting
- Check browser cookies are enabled
- Verify middleware is running
- Check cookie domain settings

### Migration errors
- Ensure you have admin access to Supabase
- Run migration in SQL Editor, not via CLI
- Check for existing `password_hash` column

## Migration Checklist

- [ ] Run `supabase-migration-add-password.sql` in Supabase SQL Editor
- [ ] Verify `password_hash` column exists in `profiles` table
- [ ] Create first admin user using `scripts/create-admin.ts`
- [ ] Test student registration at `/register`
- [ ] Test staff registration at `/register-staff`
- [ ] Test login for all three roles
- [ ] Verify session persistence across page refreshes
- [ ] Test logout functionality

## Next Steps

1. **Enhanced Security** (Optional for production):
   - Upgrade to bcrypt/argon2 for password hashing
   - Add rate limiting to prevent brute force
   - Implement 2FA for admin accounts
   - Add password reset functionality

2. **User Management**:
   - Admin panel to manage users
   - Ability to deactivate accounts
   - Password change functionality
   - Email verification (optional)

3. **Audit Logging**:
   - Log all authentication attempts
   - Track failed login attempts
   - Monitor suspicious activity

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs for database errors
3. Verify environment variables are set correctly
4. Ensure migration was run successfully

## Files Changed

### New Files
- `src/lib/auth/password.ts` - Password hashing utilities
- `src/lib/auth/session.ts` - Session management
- `src/app/api/auth/login/route.ts` - Login API
- `src/app/api/auth/register/route.ts` - Student registration API
- `src/app/api/auth/register-staff/route.ts` - Staff registration API
- `src/app/api/auth/logout/route.ts` - Logout API
- `src/app/api/auth/me/route.ts` - Get current user API
- `src/middleware.ts` - Route protection middleware
- `src/hooks/useAuth.ts` - Client-side auth hook
- `scripts/create-admin.ts` - Admin creation script
- `supabase-migration-add-password.sql` - Database migration

### Modified Files
- `src/app/(auth)/login/page.tsx` - Updated to use new API
- `src/app/(auth)/register/page.tsx` - Updated to use new API
- `src/app/(auth)/register-staff/page.tsx` - Updated to use new API
- `src/lib/validations/auth.ts` - Simplified password requirements
- `src/types/database.ts` - Added password_hash field

## Conclusion

The new authentication system is simpler, faster, and doesn't require email confirmation. It's perfect for prototypes and internal applications where you control user registration.
