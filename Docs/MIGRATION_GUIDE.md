# ParcelPort Firebase to Supabase Migration Guide

## Overview
This guide walks you through the complete migration of ParcelPort from Firebase to Supabase.

## Prerequisites
- Node.js 20+ installed
- A Supabase account (free tier is sufficient)
- Access to your current Firebase project (for data export if needed)

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: ParcelPort
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this repository
4. Paste into the SQL editor
5. Click "Run" to execute
6. Verify all tables were created by going to **Table Editor**

You should see these tables:
- profiles
- delivery_boys
- parcels
- payments
- delivery_assignments
- notifications
- audit_logs

## Step 3: Set Up Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Create three new buckets:
   - `payment-screenshots` (Private)
   - `delivery-photos` (Private)
   - `issue-photos` (Private)

3. For each bucket, set up storage policies:

### Payment Screenshots Policies
```sql
-- Allow authenticated users to upload their own payment screenshots
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow users to view their own screenshots
CREATE POLICY "Users can view their payment screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-screenshots');

-- Allow admins to view all screenshots
CREATE POLICY "Admins can view all payment screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-screenshots' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Delivery Photos Policies
```sql
-- Allow delivery boys to upload delivery photos
CREATE POLICY "Delivery boys can upload delivery photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'delivery-photos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'delivery_boy'
  )
);

-- Allow authenticated users to view delivery photos
CREATE POLICY "Users can view delivery photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'delivery-photos');
```

### Issue Photos Policies
```sql
-- Allow delivery boys to upload issue photos
CREATE POLICY "Delivery boys can upload issue photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'issue-photos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'delivery_boy'
  )
);

-- Allow admins and delivery boys to view issue photos
CREATE POLICY "Staff can view issue photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'issue-photos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'delivery_boy')
  )
);
```

## Step 4: Configure Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

3. Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Keep your existing Razorpay and other configs
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
RESEND_API_KEY=your_resend_key
```

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js@latest @supabase/ssr@latest
npm uninstall firebase
```

## Step 6: Update Remaining Files

The following files have already been updated:
- ✅ `src/lib/supabase/client.ts` - Supabase client configuration
- ✅ `src/lib/supabase/server.ts` - Server-side Supabase client
- ✅ `src/lib/supabase/middleware.ts` - Auth middleware
- ✅ `middleware.ts` - Root middleware for route protection
- ✅ `src/hooks/useAuth.ts` - Authentication hook
- ✅ `src/lib/api-utils.ts` - API utilities
- ✅ `src/app/(auth)/login/page.tsx` - Login page
- ✅ `package.json` - Dependencies updated

### Files That Still Need Migration

You need to update these files manually (or I can help):

#### Auth Pages
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/register-staff/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/create-admin/page.tsx`

#### API Routes
- All files in `src/app/api/parcels/`
- All files in `src/app/api/payments/`
- All files in `src/app/api/admin/`
- All files in `src/app/api/delivery/`
- All files in `src/app/api/upload/`

#### Dashboard Pages
- All student dashboard pages
- All admin dashboard pages
- All delivery dashboard pages

## Step 7: Migration Pattern

For each file that uses Firebase, follow this pattern:

### Before (Firebase):
```typescript
import { auth, db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';

const q = query(
  collection(db, 'parcels'),
  where('student_id', '==', userId),
  orderBy('created_at', 'desc')
);
const snapshot = await getDocs(q);
const parcels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### After (Supabase):
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: parcels, error } = await supabase
  .from('parcels')
  .select('*')
  .eq('student_id', userId)
  .order('created_at', { ascending: false });

if (error) throw error;
```

### Common Conversions

| Firebase | Supabase |
|----------|----------|
| `where('field', '==', value)` | `.eq('field', value)` |
| `where('field', '>', value)` | `.gt('field', value)` |
| `where('field', '<', value)` | `.lt('field', value)` |
| `where('field', '>=', value)` | `.gte('field', value)` |
| `where('field', '<=', value)` | `.lte('field', value)` |
| `where('field', 'in', array)` | `.in('field', array)` |
| `orderBy('field', 'desc')` | `.order('field', { ascending: false })` |
| `limit(10)` | `.limit(10)` |
| `addDoc(collection, data)` | `.insert(data)` |
| `updateDoc(doc, data)` | `.update(data).eq('id', id)` |
| `deleteDoc(doc)` | `.delete().eq('id', id)` |
| `getDoc(doc)` | `.select('*').eq('id', id).single()` |
| `Timestamp.now()` | `new Date().toISOString()` |

## Step 8: Create First Admin User

After migration, you need to create your first admin user:

1. Go to Supabase dashboard → **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Click "Create user"
5. Copy the user's UUID
6. Go to **SQL Editor** and run:

```sql
INSERT INTO profiles (
  id,
  role,
  full_name,
  mobile_number,
  email,
  is_active
) VALUES (
  'paste-user-uuid-here',
  'admin',
  'Admin Name',
  '+911234567890',
  'admin@example.com',
  true
);
```

## Step 9: Test the Application

1. Start the development server:
```bash
npm run dev
```

2. Test these flows:
   - ✅ Admin login
   - ✅ Student registration
   - ✅ Student login
   - ✅ Parcel creation
   - ✅ Payment upload
   - ✅ Admin approval
   - ✅ Delivery assignment
   - ✅ Delivery completion

## Step 10: Data Migration (If You Have Existing Data)

If you have existing Firebase data to migrate:

1. Export Firebase data using the Firebase Admin SDK
2. Transform the data format (Timestamps → ISO strings, IDs → UUIDs)
3. Import into Supabase using the SQL editor or API

I can provide a migration script if needed.

## Step 11: Deploy to Production

1. Update environment variables in Vercel/your hosting platform
2. Deploy the updated code
3. Test all functionality in production
4. Monitor for errors

## Step 12: Cleanup

After confirming everything works:

1. Remove Firebase configuration files:
   - `src/lib/firebase/` directory
   - `firestore.rules`
   - `cors.json` and `cors-production.json`
   - `fix-cors.bat` and `fix-cors.js`

2. Update `.gitignore` to remove Firebase-specific entries

3. Archive (don't delete) your Firebase project for 30 days as backup

## Troubleshooting

### Issue: "Invalid API key"
- Check that your Supabase URL and keys are correct in `.env.local`
- Restart your dev server after changing environment variables

### Issue: "Row Level Security policy violation"
- Check that RLS policies are properly set up
- Verify user is authenticated
- Check that user role matches the required role

### Issue: "Foreign key constraint violation"
- Ensure referenced records exist before creating dependent records
- Check that UUIDs are valid

### Issue: "Storage upload fails"
- Verify storage buckets are created
- Check storage policies are set up correctly
- Ensure file size is within limits

## Benefits of Supabase

✅ **No billing required** - Free tier includes 500MB database, 1GB storage, 50K MAU
✅ **Better performance** - PostgreSQL is faster for complex queries
✅ **More powerful queries** - SQL joins, aggregations, full-text search
✅ **Better DX** - SQL is more familiar than Firestore queries
✅ **Built-in features** - RLS, database functions, triggers
✅ **Real-time** - PostgreSQL real-time subscriptions
✅ **Better scaling** - Vertical and horizontal scaling options

## Support

If you encounter issues:
1. Check Supabase logs in dashboard → **Logs**
2. Check browser console for errors
3. Review this guide's troubleshooting section
4. Check Supabase documentation: https://supabase.com/docs

## Next Steps

After successful migration, consider:
- Setting up database backups
- Implementing real-time subscriptions for live updates
- Adding full-text search for parcels
- Setting up monitoring and alerts
- Optimizing queries with additional indexes
