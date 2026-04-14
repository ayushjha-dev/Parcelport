# Complete Firebase to Supabase Migration Prompt for ParcelPort

## Project Overview
ParcelPort is a university hostel parcel delivery management system built with Next.js 16.2, TypeScript, and currently using Firebase (Authentication, Firestore, Storage). The system has three user roles: Students, Admins, and Delivery Boys, with comprehensive parcel tracking, payment processing (Razorpay), and delivery management features.

---

## Current Firebase Architecture

### 1. Firebase Services Used
- **Firebase Authentication**: Email/password authentication with role-based access
- **Firestore Database**: NoSQL document database with 7 main collections
- **Firebase Storage**: File storage for payment screenshots and delivery photos
- **Firebase Admin SDK**: Optional server-side operations

### 2. Firestore Collections Schema

#### Collection: `users`
```typescript
{
  id: string (document ID = Firebase Auth UID)
  email: string
  name: string
  phone: string (format: "+91XXXXXXXXXX")
  role: 'student' | 'admin' | 'delivery_boy'
  created_at: Timestamp
  updated_at: Timestamp (optional)
}
```

#### Collection: `students`
```typescript
{
  id: string (document ID = user_id)
  user_id: string (references users collection)
  enrollment_number: string (student roll number)
  hostel_block: string ('a' | 'b' | 'c' | 'g')
  room_number: string
  floor_number: string
  year: number
  department: string (course/branch)
  landmark_note: string (optional)
  created_at: Timestamp
}
```

#### Collection: `parcels`
```typescript
{
  id: string (auto-generated document ID)
  drid: string (unique tracking ID, format: "DRID-YYYYMMDD-XXXX")
  student_id: string (references users.id)
  student_name: string
  student_roll_no: string
  student_mobile: string
  student_email: string
  hostel_block: string
  floor_number: string
  room_number: string
  landmark_note: string | null
  parcel_awb: string (courier tracking number)
  courier_company: 'amazon' | 'flipkart' | 'dtdc' | 'bluedart' | 'delhivery' | 'ekart' | 'speed_post' | 'other'
  parcel_description: string
  weight_range: 'under_1kg' | '1_to_5kg' | '5_to_10kg' | 'over_10kg' | null
  expected_date: string | null (ISO date string)
  preferred_time_slot: 'morning' | 'afternoon' | 'evening'
  is_fragile: boolean
  status: 'pending_payment' | 'payment_verified' | 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'issue_reported' | 'payment_failed' | 'cancelled'
  otp: string (6-digit OTP for delivery verification)
  otp_verified: boolean (optional)
  delivery_boy_id: string | null (references delivery_boys.id when assigned)
  admin_note: string | null
  rejected_reason: string | null
  created_at: Timestamp
  updated_at: Timestamp
  picked_up_at: Timestamp | null
  delivered_at: Timestamp | null
  assigned_at: Timestamp | null
  scheduled_date: Timestamp | null (used for delivery scheduling)
}
```

#### Collection: `payments`
```typescript
{
  id: string (auto-generated)
  parcel_id: string (references parcels.id)
  student_id: string (references users.id)
  amount: number (delivery fee, typically 10)
  payment_method: 'upi' | 'debit_card' | 'credit_card' | 'net_banking' | 'cash'
  transaction_id: string | null
  screenshot_url: string | null (Firebase Storage URL)
  status: 'pending' | 'completed' | 'failed' | 'rejected'
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  rejection_reason: string | null
  created_at: Timestamp
  updated_at: Timestamp
  verified_at: Timestamp | null
}
```

#### Collection: `delivery_boys`
```typescript
{
  id: string (auto-generated)
  user_id: string | null (references users.id if registered)
  name: string
  mobile: string
  email: string | null
  is_active: boolean
  campus_zone: string | null
  created_at: Timestamp
  updated_at: Timestamp
}
```

#### Collection: `notifications`
```typescript
{
  id: string (auto-generated)
  user_id: string (references users.id)
  parcel_id: string | null (references parcels.id)
  title: string
  message: string
  type: 'delivery' | 'payment' | 'system' | 'alert'
  is_read: boolean
  action_url: string | null
  created_at: Timestamp
}
```

#### Collection: `delivery_issues`
```typescript
{
  id: string (auto-generated)
  drid: string (references parcels.drid)
  issue_type: 'student_not_available' | 'wrong_room' | 'parcel_not_at_gate' | 'student_refused' | 'other'
  description: string
  reported_by_id: string (references users.id - delivery boy)
  photo_url: string | null (Firebase Storage URL)
  status: 'open' | 'resolved' | 'closed'
  created_at: Timestamp
  resolved_at: Timestamp | null
}
```

### 3. Firebase Storage Structure
```
/payment-screenshots/
  ├── {timestamp}-{random}.jpg
  ├── {timestamp}-{random}.png
  └── ...

/delivery-photos/
  ├── {timestamp}-{random}.jpg
  └── ...

/issue-photos/
  ├── {timestamp}-{random}.jpg
  └── ...
```

### 4. Firestore Security Rules
- Users can read their own documents
- Users can create their own profile during registration
- Authenticated users can read parcels (filtered by role)
- Authenticated users can create/update parcels
- Role-based access for admin operations
- All writes require authentication

### 5. Current File Structure
```
src/
├── lib/
│   ├── firebase/
│   │   ├── config.ts          # Firebase initialization
│   │   ├── client.ts          # Client-side exports
│   │   └── admin.ts           # Admin SDK (optional)
│   ├── api-utils.ts           # Firestore query helpers
│   ├── utils.ts               # General utilities
│   └── validations/           # Zod schemas
├── hooks/
│   ├── useAuth.ts             # Firebase Auth hook
│   └── useParcels.ts          # Firestore queries with React Query
├── app/
│   ├── api/                   # Next.js API routes
│   │   ├── parcels/route.ts
│   │   ├── payments/
│   │   ├── admin/
│   │   ├── delivery/
│   │   └── upload/route.ts    # Firebase Storage upload
│   ├── (auth)/                # Auth pages
│   ├── (student)/             # Student portal
│   ├── (admin)/               # Admin portal
│   └── (delivery)/            # Delivery portal
└── types/
    └── database.ts            # TypeScript types (already Supabase-ready!)
```

---

## Migration Requirements

### Phase 1: Supabase Setup & Database Migration

#### 1.1 Create Supabase Project
- Create new Supabase project
- Note the project URL and anon key
- Enable email authentication

#### 1.2 Database Schema Creation
Create PostgreSQL tables matching the Firestore collections. Use the TypeScript types in `src/types/database.ts` as the source of truth. Key requirements:

**Table: profiles** (replaces `users` and `students` collections)
- Primary key: `id` (UUID, references auth.users)
- Add all fields from both `users` and `students` collections
- Use ENUM types for: `user_role`, `courier_company`, `weight_range`, `time_slot`
- Add RLS policies for user self-access and admin access
- Add trigger for `updated_at` timestamp

**Table: parcels**
- Primary key: `id` (UUID)
- Foreign key: `student_id` references `profiles(id)`
- Foreign key: `delivery_boy_id` references `delivery_boys(id)` (nullable)
- Unique constraint on `drid`
- Use ENUM for `parcel_status`, `courier_company`, `weight_range`, `time_slot`
- Add indexes on: `student_id`, `drid`, `status`, `created_at`
- Add RLS policies: students see their own, delivery boys see assigned, admins see all

**Table: payments**
- Primary key: `id` (UUID)
- Foreign key: `parcel_id` references `parcels(id)` ON DELETE CASCADE
- Use ENUM for `payment_method`, `payment_status`
- Add indexes on: `parcel_id`, `status`, `razorpay_order_id`
- Add RLS policies similar to parcels

**Table: delivery_boys**
- Primary key: `id` (UUID)
- Foreign key: `profile_id` references `profiles(id)` (nullable)
- Add index on `is_active`

**Table: delivery_assignments** (new table for better tracking)
- Primary key: `id` (UUID)
- Foreign key: `parcel_id` references `parcels(id)`
- Foreign key: `delivery_boy_id` references `delivery_boys(id)`
- Track OTP, pickup, delivery, and failure details
- Add indexes on: `parcel_id`, `delivery_boy_id`

**Table: notifications**
- Primary key: `id` (UUID)
- Foreign key: `user_id` references `profiles(id)` ON DELETE CASCADE
- Foreign key: `parcel_id` references `parcels(id)` ON DELETE SET NULL
- Add index on: `user_id`, `is_read`, `created_at`

**Table: audit_logs** (new table for tracking changes)
- Primary key: `id` (UUID)
- Track all status changes and important actions
- Store metadata as JSONB

#### 1.3 Row Level Security (RLS) Policies
Enable RLS on all tables and create policies:
- Students: Can read/update their own profile, read their parcels
- Delivery Boys: Can read assigned parcels, update delivery status
- Admins: Full access to all tables
- Public: No access (all operations require authentication)

#### 1.4 Database Functions
Create PostgreSQL functions for:
- `generate_drid()`: Generate unique DRID tracking numbers
- `generate_otp()`: Generate 6-digit OTP codes
- `update_updated_at()`: Trigger function for timestamp updates

### Phase 2: Authentication Migration

#### 2.1 Replace Firebase Auth with Supabase Auth
- Install `@supabase/supabase-js` and `@supabase/auth-helpers-nextjs`
- Create `src/lib/supabase/client.ts` for client-side Supabase client
- Create `src/lib/supabase/server.ts` for server-side Supabase client
- Create `src/lib/supabase/middleware.ts` for auth middleware

#### 2.2 Update Authentication Hook
Modify `src/hooks/useAuth.ts`:
- Replace Firebase Auth methods with Supabase Auth
- Use `supabase.auth.signInWithPassword()` for login
- Use `supabase.auth.signUp()` for registration
- Use `supabase.auth.signOut()` for logout
- Use `supabase.auth.onAuthStateChange()` for session management
- Update profile operations to use Supabase database queries

#### 2.3 Update Auth Pages
Modify files in `src/app/(auth)/`:
- `login/page.tsx`: Replace Firebase signIn with Supabase
- `register/page.tsx`: Replace Firebase createUser with Supabase signUp + profile insert
- `forgot-password/page.tsx`: Use Supabase password reset
- Update role verification to query `profiles` table

#### 2.4 Implement Route Protection
- Create middleware.ts in root for auth protection
- Use Supabase Auth Helpers for Next.js
- Protect routes based on user role from `profiles` table

### Phase 3: Database Operations Migration

#### 3.1 Replace Firestore Queries with Supabase
Update `src/lib/api-utils.ts`:
- Remove Firebase imports
- Add Supabase client initialization
- Replace `queryCollection()` with Supabase query builder
- Update error/success response helpers
- Remove Timestamp exports, use ISO strings

#### 3.2 Update API Routes
For each API route in `src/app/api/`:

**Parcels API** (`api/parcels/route.ts`):
- Replace `collection(db, 'parcels')` with `supabase.from('parcels')`
- Replace `addDoc()` with `.insert()`
- Replace `getDocs()` with `.select()`
- Replace `where()` with `.eq()`, `.gte()`, etc.
- Replace `orderBy()` with `.order()`
- Use `.single()` for single document queries
- Handle Supabase error responses

**Payments API** (`api/payments/`):
- Update all Firestore queries to Supabase
- Maintain Razorpay integration (no changes needed)
- Update payment verification logic
- Use transactions for payment + parcel status updates

**Admin API** (`api/admin/`):
- Update parcel queries with proper joins
- Use Supabase's `.select('*, profiles(*)')` for related data
- Implement proper authorization checks using RLS
- Update delivery boy management

**Delivery API** (`api/delivery/`):
- Update pickup/delivery status updates
- Implement OTP verification using database function
- Update issue reporting with proper foreign keys

**Upload API** (`api/upload/route.ts`):
- Replace Firebase Storage with Supabase Storage
- Use `supabase.storage.from('bucket').upload()`
- Update bucket names and paths
- Get public URLs using `.getPublicUrl()`

#### 3.3 Update React Query Hooks
Modify `src/hooks/useParcels.ts`:
- Replace Firestore queries with Supabase queries
- Update query keys for React Query
- Handle Supabase error format
- Use Supabase real-time subscriptions for live updates (optional enhancement)

### Phase 4: Storage Migration

#### 4.1 Create Supabase Storage Buckets
- Create bucket: `payment-screenshots` (private)
- Create bucket: `delivery-photos` (private)
- Create bucket: `issue-photos` (private)
- Set up storage policies for authenticated uploads

#### 4.2 Update File Upload Component
Modify `src/components/shared/FileUpload.tsx`:
- Replace Firebase Storage upload with Supabase Storage
- Update file path structure
- Handle Supabase storage errors
- Update progress tracking if needed

#### 4.3 Update Upload API
Modify `src/app/api/upload/route.ts`:
- Replace `ref(storage, fileName)` with `supabase.storage.from(bucket)`
- Replace `uploadBytes()` with `.upload()`
- Replace `getDownloadURL()` with `.getPublicUrl()` or signed URLs
- Maintain file size validation (5MB limit)

### Phase 5: Environment Variables & Configuration

#### 5.1 Update Environment Variables
Replace in `.env.local`:
```env
# Remove Firebase variables
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=
# FIREBASE_ADMIN_SDK_KEY=

# Add Supabase variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Keep existing
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
```

#### 5.2 Update Package Dependencies
In `package.json`:
```json
{
  "dependencies": {
    // Remove
    // "firebase": "^12.12.0",
    
    // Add
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    
    // Keep all other dependencies unchanged
  }
}
```

### Phase 6: Data Migration (If Existing Data)

#### 6.1 Export Firebase Data
- Use Firebase Admin SDK to export all collections
- Export as JSON files
- Include all subcollections and nested data

#### 6.2 Transform Data Format
- Convert Firestore Timestamps to ISO strings
- Transform document IDs to UUIDs
- Flatten nested structures if needed
- Map collection relationships to foreign keys

#### 6.3 Import to Supabase
- Use Supabase SQL editor or API
- Import in order: profiles → delivery_boys → parcels → payments → notifications
- Verify data integrity and relationships
- Update sequences for auto-increment fields

### Phase 7: Testing & Validation

#### 7.1 Authentication Testing
- Test student registration and login
- Test admin login
- Test delivery boy login
- Test role-based redirects
- Test password reset flow

#### 7.2 Feature Testing
- Test parcel registration (all 4 steps)
- Test payment upload and verification
- Test admin approval workflow
- Test parcel assignment to delivery boys
- Test delivery status updates
- Test OTP verification
- Test issue reporting

#### 7.3 API Testing
- Test all GET endpoints with filters
- Test all POST endpoints with validation
- Test UPDATE operations
- Test file uploads
- Test error handling

#### 7.4 Performance Testing
- Test query performance with indexes
- Test RLS policy performance
- Test file upload speed
- Compare with Firebase performance

### Phase 8: Deployment & Cleanup

#### 8.1 Update Deployment Configuration
- Update Vercel environment variables
- Test on preview deployment first
- Update CORS settings if needed
- Update CSP headers for Supabase domains

#### 8.2 Remove Firebase Dependencies
- Delete `src/lib/firebase/` directory
- Remove Firebase imports from all files
- Remove `firestore.rules` file
- Remove CORS configuration files
- Update README.md with Supabase setup instructions

#### 8.3 Update Documentation
- Update README.md with Supabase setup steps
- Create Supabase migration guide
- Update API documentation
- Update deployment guide

---

## Critical Migration Notes

### 1. Timestamp Handling
- Firebase uses `Timestamp` objects
- Supabase uses ISO 8601 strings
- Update all date comparisons and formatting
- Use `new Date().toISOString()` for timestamps

### 2. Document IDs vs UUIDs
- Firebase auto-generates document IDs
- Supabase uses UUIDs by default
- Update all ID references
- Use `gen_random_uuid()` in PostgreSQL

### 3. Real-time Updates
- Firebase has built-in real-time listeners
- Supabase has real-time subscriptions (optional)
- Consider implementing for live parcel tracking
- Use `supabase.channel().on('postgres_changes')`

### 4. Query Differences
- Firebase: `where('field', '==', value)`
- Supabase: `.eq('field', value)`
- Firebase: `orderBy('field', 'desc')`
- Supabase: `.order('field', { ascending: false })`
- Firebase: Compound queries need indexes
- Supabase: Use standard SQL indexes

### 5. File Storage URLs
- Firebase: Permanent download URLs
- Supabase: Public URLs or signed URLs (expiring)
- Consider using signed URLs for sensitive files
- Update URL generation in components

### 6. Authentication State
- Firebase: `onAuthStateChanged()`
- Supabase: `onAuthStateChange()`
- Firebase: User object structure different
- Supabase: Session-based authentication

### 7. Error Handling
- Firebase errors: `error.code` (e.g., 'auth/user-not-found')
- Supabase errors: `error.message` and `error.code`
- Update all error handling logic
- Map common errors to user-friendly messages

### 8. Security Rules vs RLS
- Firebase: Custom security rules language
- Supabase: PostgreSQL RLS policies
- RLS is more powerful and flexible
- Test policies thoroughly

---

## Migration Checklist

### Pre-Migration
- [ ] Backup all Firebase data
- [ ] Document current Firebase configuration
- [ ] Review all Firebase dependencies
- [ ] Create Supabase project
- [ ] Set up local development environment

### Database Setup
- [ ] Create all PostgreSQL tables
- [ ] Create ENUM types
- [ ] Add foreign key constraints
- [ ] Create indexes
- [ ] Set up RLS policies
- [ ] Create database functions
- [ ] Test database schema

### Authentication
- [ ] Install Supabase packages
- [ ] Create Supabase client utilities
- [ ] Update useAuth hook
- [ ] Update login page
- [ ] Update register page
- [ ] Update password reset
- [ ] Implement route protection
- [ ] Test authentication flow

### API Routes
- [ ] Update api-utils.ts
- [ ] Migrate parcels API
- [ ] Migrate payments API
- [ ] Migrate admin API
- [ ] Migrate delivery API
- [ ] Migrate upload API
- [ ] Migrate notifications API
- [ ] Test all API endpoints

### Storage
- [ ] Create Supabase storage buckets
- [ ] Set up storage policies
- [ ] Update FileUpload component
- [ ] Update upload API
- [ ] Test file uploads
- [ ] Migrate existing files (if any)

### Frontend
- [ ] Update all Firestore queries
- [ ] Update React Query hooks
- [ ] Update components using auth
- [ ] Update timestamp formatting
- [ ] Test all user flows

### Configuration
- [ ] Update environment variables
- [ ] Update package.json
- [ ] Update next.config.ts if needed
- [ ] Update .gitignore
- [ ] Update README.md

### Testing
- [ ] Test student registration
- [ ] Test student login
- [ ] Test parcel registration
- [ ] Test payment flow
- [ ] Test admin operations
- [ ] Test delivery operations
- [ ] Test file uploads
- [ ] Test notifications
- [ ] Test error scenarios

### Deployment
- [ ] Update Vercel environment variables
- [ ] Deploy to preview
- [ ] Test preview deployment
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Update documentation

### Cleanup
- [ ] Remove Firebase packages
- [ ] Delete Firebase configuration files
- [ ] Remove unused imports
- [ ] Clean up environment variables
- [ ] Archive Firebase project (don't delete immediately)

---

## Expected Benefits After Migration

1. **No Billing Required**: Supabase free tier is generous (500MB database, 1GB storage, 50,000 monthly active users)
2. **Better Performance**: PostgreSQL is faster for complex queries
3. **More Powerful Queries**: SQL joins, aggregations, full-text search
4. **Better Developer Experience**: SQL is more familiar than Firestore queries
5. **Built-in Features**: Row Level Security, database functions, triggers
6. **Real-time Capabilities**: PostgreSQL real-time subscriptions
7. **Better Scaling**: Vertical and horizontal scaling options
8. **Cost Predictability**: Clear pricing tiers, no surprise bills

---

## Estimated Migration Time

- **Phase 1 (Database Setup)**: 4-6 hours
- **Phase 2 (Authentication)**: 3-4 hours
- **Phase 3 (Database Operations)**: 8-10 hours
- **Phase 4 (Storage)**: 2-3 hours
- **Phase 5 (Configuration)**: 1-2 hours
- **Phase 6 (Data Migration)**: 2-4 hours (if existing data)
- **Phase 7 (Testing)**: 4-6 hours
- **Phase 8 (Deployment)**: 2-3 hours

**Total Estimated Time**: 26-38 hours (3-5 days of focused work)

---

## Support Resources

- Supabase Documentation: https://supabase.com/docs
- Supabase Auth Helpers: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- Supabase Storage: https://supabase.com/docs/guides/storage
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Migration Guide: https://supabase.com/docs/guides/migrations

---

## Final Notes

This migration is straightforward because:
1. Your TypeScript types are already Supabase-ready
2. The project structure is clean and well-organized
3. No complex Firebase features are used (no Cloud Functions, no Realtime Database)
4. Authentication is simple email/password
5. Storage is basic file uploads

The main work is:
1. Creating the PostgreSQL schema
2. Replacing Firebase SDK calls with Supabase SDK calls
3. Testing thoroughly

Good luck with the migration! 🚀
