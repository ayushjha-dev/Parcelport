# Supabase Setup Guide for ParcelPort

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `ParcelPort`
   - Database Password: (save this securely!)
   - Region: Choose closest to your users
4. Wait for project creation (~2 minutes)

### 3. Set Up Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute
5. Verify tables in **Table Editor**

### 4. Configure Storage

1. Go to **Storage** in Supabase Dashboard
2. Create three buckets:
   - `payment-screenshots` (Private)
   - `delivery-photos` (Private)
   - `issue-photos` (Private)

3. For each bucket, go to **Policies** and add:

#### Payment Screenshots
```sql
-- Upload policy
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

-- View policy
CREATE POLICY "Users can view their payment screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-screenshots');
```

#### Delivery Photos
```sql
-- Upload policy
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

-- View policy
CREATE POLICY "Users can view delivery photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'delivery-photos');
```

#### Issue Photos
```sql
-- Upload policy
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

-- View policy
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

### 5. Configure Environment Variables

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy:
   - Project URL
   - anon public key
   - service_role key

3. Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Razorpay (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Resend (for emails - optional)
RESEND_API_KEY=your_resend_key
```

### 6. Create First Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Copy the user's UUID
5. Go to **SQL Editor** and run:

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

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing

Test these flows:

1. **Admin Login**
   - Go to `/login`
   - Select "Admin" role
   - Login with admin credentials

2. **Student Registration**
   - Go to `/register`
   - Fill in all details
   - Create account

3. **Student Login**
   - Go to `/login`
   - Select "Student" role
   - Login with student credentials

4. **Parcel Registration**
   - Login as student
   - Go to "Register Parcel"
   - Complete all 4 steps

5. **Payment Upload**
   - Upload payment screenshot
   - Wait for admin approval

6. **Admin Approval**
   - Login as admin
   - Go to "Payments"
   - Approve/reject payments

## Database Schema Overview

### Tables

- **profiles**: User accounts (students, admins, delivery boys)
- **delivery_boys**: Delivery staff information
- **parcels**: Parcel tracking and details
- **payments**: Payment records and verification
- **delivery_assignments**: Delivery boy assignments and OTP
- **notifications**: User notifications
- **audit_logs**: System audit trail

### Key Features

- **Row Level Security (RLS)**: Automatic data access control
- **Triggers**: Auto-update timestamps
- **Functions**: Generate DRID and OTP
- **Indexes**: Optimized query performance
- **Foreign Keys**: Data integrity

## Common Issues

### Issue: "Invalid API key"
**Solution**: Check `.env.local` has correct Supabase URL and keys. Restart dev server.

### Issue: "Row Level Security policy violation"
**Solution**: Verify RLS policies are set up correctly. Check user is authenticated.

### Issue: "Foreign key constraint violation"
**Solution**: Ensure referenced records exist before creating dependent records.

### Issue: "Storage upload fails"
**Solution**: Verify storage buckets exist and policies are configured.

## Migration from Firebase

If you're migrating from Firebase, see `MIGRATION_GUIDE.md` for detailed instructions.

## Production Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `RESEND_API_KEY`
4. Deploy

### Other Platforms

Ensure environment variables are set and Node.js 20+ is available.

## Database Backups

Supabase automatically backs up your database. To create manual backups:

1. Go to **Database** → **Backups**
2. Click "Create backup"
3. Download backup file

## Monitoring

Monitor your application:

1. **Logs**: Supabase Dashboard → **Logs**
2. **API Usage**: Dashboard → **Reports**
3. **Database Performance**: Dashboard → **Database** → **Query Performance**

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create an issue in your repository

## Next Steps

After setup:

1. ✅ Test all user flows
2. ✅ Configure email templates in Supabase Auth
3. ✅ Set up monitoring and alerts
4. ✅ Configure database backups
5. ✅ Review and optimize RLS policies
6. ✅ Add additional indexes if needed
7. ✅ Set up staging environment
8. ✅ Deploy to production

## Security Checklist

- [ ] Service role key is kept secret (never in client code)
- [ ] RLS policies are enabled on all tables
- [ ] Storage policies are configured correctly
- [ ] Environment variables are not committed to git
- [ ] HTTPS is enforced in production
- [ ] Rate limiting is configured
- [ ] Database backups are enabled
- [ ] Monitoring and alerts are set up

## Performance Tips

1. **Use indexes**: Already configured in schema
2. **Optimize queries**: Use `.select()` to fetch only needed columns
3. **Enable caching**: Use React Query for client-side caching
4. **Use connection pooling**: Supabase handles this automatically
5. **Monitor slow queries**: Check Database → Query Performance

## Cost Optimization

Supabase Free Tier includes:
- 500MB database storage
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth

For production, consider:
- Pro plan: $25/month (8GB database, 100GB storage)
- Monitor usage in Dashboard → Reports
- Optimize queries to reduce database load
- Use CDN for static assets

## Useful SQL Queries

### Check parcel statistics
```sql
SELECT 
  status,
  COUNT(*) as count
FROM parcels
GROUP BY status
ORDER BY count DESC;
```

### Find active delivery boys
```sql
SELECT 
  db.name,
  db.mobile,
  COUNT(da.id) as active_deliveries
FROM delivery_boys db
LEFT JOIN delivery_assignments da ON db.id = da.delivery_boy_id
WHERE db.is_active = true
  AND da.delivered_at IS NULL
GROUP BY db.id, db.name, db.mobile;
```

### Recent payments pending approval
```sql
SELECT 
  p.drid,
  pr.full_name,
  pay.delivery_fee_amount,
  pay.created_at
FROM payments pay
JOIN parcels p ON pay.parcel_id = p.id
JOIN profiles pr ON p.student_id = pr.id
WHERE pay.delivery_fee_status = 'pending'
ORDER BY pay.created_at DESC
LIMIT 10;
```
