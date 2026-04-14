# Supabase Setup Complete ✅

## Project Information
- **Project Name**: ParcelPort
- **Project ID**: lovtryryapotbdabzogw
- **Region**: Asia Pacific (Mumbai) - ap-south-1
- **Status**: Active & Healthy
- **Dashboard**: https://app.supabase.com/

## Completed Tasks

### 1. ✅ Database Schema Applied
All tables created with Row Level Security (RLS) enabled:
- `profiles` - User accounts (students, admins, delivery boys)
- `delivery_boys` - Delivery staff information
- `parcels` - Parcel tracking and details
- `payments` - Payment records and verification
- `delivery_assignments` - Delivery boy assignments with OTP
- `notifications` - User notifications
- `audit_logs` - Audit trail for actions

**Database Functions Created**:
- `generate_drid()` - Generates unique delivery request IDs (DRID-YYYYMMDD-XXXX)
- `generate_otp()` - Generates 6-digit OTP codes

**Indexes Created**: Performance optimizations for all major queries

### 2. ✅ Storage Buckets Created
Three private storage buckets configured:
- `payment-screenshots` - For payment verification screenshots
- `delivery-photos` - For delivery confirmation photos
- `issue-photos` - For delivery failure/issue photos

### 3. ✅ Storage Policies Applied
Row Level Security policies configured for:

**Payment Screenshots Bucket**:
- Users can upload payment screenshots
- Users can view their own screenshots
- Admins can view all screenshots
- Admins can delete screenshots

**Delivery Photos Bucket**:
- Delivery boys can upload photos
- All authenticated users can view delivery photos
- Delivery boys can update their photos

**Issue Photos Bucket**:
- Delivery boys can upload issue photos
- Only admins and delivery boys can view issue photos
- Delivery boys can update issue photos

### 4. ✅ Environment Variables Configured
Updated `.env.local` with Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL=https://lovtryryapotbdabzogw.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY=<pending>`

### 5. ✅ TypeScript Types Generated
Auto-generated database types available at:
- **Location**: `src/lib/supabase/database.types.ts`
- **Import**: `import { Database } from '@/lib/supabase/database.types'`
- **Types Generated**: Full type support for all tables, enums, and relationships

## RLS Policies Summary

### profiles
- Users can view/update their own profile
- Admins can view/update all profiles

### delivery_boys
- Admins can manage all delivery boys
- Delivery boys can view their own records

### parcels
- Students can view/create their own parcels
- Admins can view/update all parcels
- Delivery boys can view/update assigned parcels

### payments
- Students can view/create their own payments
- Admins can manage all payments

### delivery_assignments
- Admins can manage all assignments
- Delivery boys can view/update their assignments

### notifications
- Users can view/update their own notifications
- System can create notifications

## 🚀 Next Steps

### 1. Get Service Role Key (REQUIRED)
1. Go to https://app.supabase.com/
2. Select **ParcelPort** project
3. Navigate to **Settings** → **API**
4. Copy the **service_role** secret key
5. Update `.env.local` and replace `SUPABASE_SERVICE_ROLE_KEY`

### 2. Create First Admin User
```sql
-- In Supabase Dashboard → SQL Editor
INSERT INTO profiles (
  id,
  role,
  full_name,
  mobile_number,
  email,
  is_active
) VALUES (
  'USER_UUID_FROM_AUTH',
  'admin',
  'Admin Name',
  '+911234567890',
  'admin@example.com',
  true
);
```

Steps:
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Copy the user's **UUID**
5. Run the SQL query above with the UUID

### 3. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 4. Initialize Supabase Client
Create `src/lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### 5. Test Connection
Create a test page to verify Supabase connection works.

## Database Schema Statistics

- **Total Tables**: 7
- **Total Enums**: 8 (user_role, parcel_status, payment_method, payment_status, charge_type, courier_company, weight_range, time_slot, delivery_issue_type)
- **Total Indexes**: 20+
- **RLS Enabled**: Yes, on all tables
- **Triggers**: 5 (for updated_at timestamps)

## Important Security Notes

⚠️ **Never commit `.env.local` to version control**

The following secrets should be kept secure:
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Exposed, but signed by auth token

## Support

For issues or questions:
1. Check Supabase Dashboard for error logs
2. Review RLS policies if access is denied
3. Verify database schema in Table Editor
4. Check storage policies in Storage → Policies

---

**Setup Date**: April 14, 2026
**Setup Method**: Supabase MCP Tools
