# Supabase Quick Reference for ParcelPort

## Common Operations

### Authentication

#### Sign Up
```typescript
const supabase = createClient();
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      mobile_number: '+911234567890',
    },
  },
});
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

#### Reset Password
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://yourapp.com/reset-password',
  }
);
```

### Database Queries

#### Select All
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*');
```

#### Select Specific Columns
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('id, drid, status, student_name');
```

#### Select with Join
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select(`
    *,
    profiles:student_id (
      full_name,
      mobile_number,
      email
    )
  `);
```

#### Filter (WHERE)
```typescript
// Equal
const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .eq('student_id', userId);

// Not equal
.neq('status', 'cancelled')

// Greater than
.gt('created_at', '2024-01-01')

// Less than
.lt('created_at', '2024-12-31')

// Greater than or equal
.gte('delivery_fee_amount', 10)

// Less than or equal
.lte('delivery_fee_amount', 100)

// IN array
.in('status', ['pending', 'approved'])

// LIKE (case-sensitive)
.like('student_name', '%John%')

// ILIKE (case-insensitive)
.ilike('student_name', '%john%')

// IS NULL
.is('rejected_reason', null)

// NOT NULL
.not('rejected_reason', 'is', null)
```

#### Order By
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Limit
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .limit(10);
```

#### Pagination
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .range(0, 9); // First 10 items (0-9)

// Next page
.range(10, 19); // Next 10 items (10-19)
```

#### Single Row
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .eq('id', parcelId)
  .single();
```

#### Count
```typescript
const { count, error } = await supabase
  .from('parcels')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending');
```

#### Insert
```typescript
const { data, error } = await supabase
  .from('parcels')
  .insert({
    drid: 'DRID-20240101-0001',
    student_id: userId,
    student_name: 'John Doe',
    // ... other fields
  })
  .select()
  .single();
```

#### Insert Multiple
```typescript
const { data, error } = await supabase
  .from('notifications')
  .insert([
    { user_id: '123', title: 'Title 1', message: 'Message 1' },
    { user_id: '456', title: 'Title 2', message: 'Message 2' },
  ])
  .select();
```

#### Update
```typescript
const { data, error } = await supabase
  .from('parcels')
  .update({ status: 'delivered', delivered_at: new Date().toISOString() })
  .eq('id', parcelId)
  .select()
  .single();
```

#### Delete
```typescript
const { error } = await supabase
  .from('parcels')
  .delete()
  .eq('id', parcelId);
```

#### Upsert (Insert or Update)
```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    full_name: 'John Doe',
    mobile_number: '+911234567890',
  })
  .select()
  .single();
```

### Storage Operations

#### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('payment-screenshots')
  .upload(`${userId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false,
  });
```

#### Download File
```typescript
const { data, error } = await supabase.storage
  .from('payment-screenshots')
  .download('path/to/file.jpg');
```

#### Get Public URL
```typescript
const { data } = supabase.storage
  .from('payment-screenshots')
  .getPublicUrl('path/to/file.jpg');

const publicUrl = data.publicUrl;
```

#### Get Signed URL (Temporary)
```typescript
const { data, error } = await supabase.storage
  .from('payment-screenshots')
  .createSignedUrl('path/to/file.jpg', 60); // 60 seconds

const signedUrl = data.signedUrl;
```

#### List Files
```typescript
const { data, error } = await supabase.storage
  .from('payment-screenshots')
  .list('folder', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });
```

#### Delete File
```typescript
const { error } = await supabase.storage
  .from('payment-screenshots')
  .remove(['path/to/file.jpg']);
```

### Real-time Subscriptions

#### Subscribe to Changes
```typescript
const channel = supabase
  .channel('parcels-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // 'INSERT', 'UPDATE', 'DELETE', or '*'
      schema: 'public',
      table: 'parcels',
      filter: `student_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Unsubscribe when done
channel.unsubscribe();
```

#### Subscribe to Specific Events
```typescript
// INSERT only
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'parcels' }, handler)

// UPDATE only
.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'parcels' }, handler)

// DELETE only
.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'parcels' }, handler)
```

### Database Functions

#### Call DRID Generator
```typescript
const { data, error } = await supabase.rpc('generate_drid');
// Returns: "DRID-20240101-0001"
```

#### Call OTP Generator
```typescript
const { data, error } = await supabase.rpc('generate_otp');
// Returns: "123456"
```

### Error Handling

```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*');

if (error) {
  console.error('Error:', error.message);
  console.error('Details:', error.details);
  console.error('Hint:', error.hint);
  console.error('Code:', error.code);
  
  // Handle specific errors
  if (error.code === 'PGRST116') {
    // No rows returned
  } else if (error.code === '23505') {
    // Unique constraint violation
  } else if (error.code === '42501') {
    // Insufficient privileges (RLS policy)
  }
}
```

## Common Patterns

### Get User Profile
```typescript
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
}
```

### Check User Role
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', userId)
  .single();

if (profile?.role === 'admin') {
  // Admin-only logic
}
```

### Get Parcels with Student Info
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select(`
    *,
    student:profiles!student_id (
      full_name,
      mobile_number,
      email,
      hostel_block,
      room_number
    )
  `)
  .order('created_at', { ascending: false });
```

### Get Parcel with Payment Info
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select(`
    *,
    payment:payments!parcel_id (
      delivery_fee_amount,
      delivery_fee_status,
      delivery_fee_screenshot_url
    )
  `)
  .eq('id', parcelId)
  .single();
```

### Get Delivery Assignments with Details
```typescript
const { data, error } = await supabase
  .from('delivery_assignments')
  .select(`
    *,
    parcel:parcels!parcel_id (
      drid,
      student_name,
      hostel_block,
      room_number
    ),
    delivery_boy:delivery_boys!delivery_boy_id (
      name,
      mobile
    )
  `)
  .eq('delivery_boy_id', deliveryBoyId)
  .is('delivered_at', null);
```

### Create Parcel with Payment
```typescript
// Use a transaction-like approach
const { data: parcel, error: parcelError } = await supabase
  .from('parcels')
  .insert({
    drid: await generateDRID(),
    student_id: userId,
    // ... other fields
  })
  .select()
  .single();

if (parcelError) throw parcelError;

const { data: payment, error: paymentError } = await supabase
  .from('payments')
  .insert({
    parcel_id: parcel.id,
    delivery_fee_amount: 10,
    delivery_fee_status: 'pending',
  })
  .select()
  .single();

if (paymentError) {
  // Rollback: delete the parcel
  await supabase.from('parcels').delete().eq('id', parcel.id);
  throw paymentError;
}
```

### Update Parcel Status with Audit Log
```typescript
const oldStatus = parcel.status;
const newStatus = 'delivered';

// Update parcel
const { error: updateError } = await supabase
  .from('parcels')
  .update({
    status: newStatus,
    delivered_at: new Date().toISOString(),
  })
  .eq('id', parcelId);

if (updateError) throw updateError;

// Create audit log
await supabase
  .from('audit_logs')
  .insert({
    parcel_id: parcelId,
    actor_id: userId,
    action: 'status_change',
    old_status: oldStatus,
    new_status: newStatus,
    metadata: { delivered_by: deliveryBoyId },
  });
```

### Search Parcels
```typescript
const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .or(`drid.ilike.%${searchTerm}%,student_name.ilike.%${searchTerm}%,parcel_awb.ilike.%${searchTerm}%`)
  .order('created_at', { ascending: false });
```

### Get Statistics
```typescript
// Count by status
const { data: stats, error } = await supabase
  .from('parcels')
  .select('status')
  .then(({ data }) => {
    const counts = data?.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { data: counts, error: null };
  });
```

## React Query Integration

### Query Hook
```typescript
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useParcels(userId: string) {
  const supabase = createClient();
  
  return useQuery({
    queryKey: ['parcels', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
```

### Mutation Hook
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useCreateParcel() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (parcelData: ParcelInsert) => {
      const { data, error } = await supabase
        .from('parcels')
        .insert(parcelData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Server-side only

# Optional
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://xxxxx.supabase.co/storage/v1
```

## TypeScript Types

```typescript
import type { Database } from '@/types/database';

// Table types
type Parcel = Database['public']['Tables']['parcels']['Row'];
type ParcelInsert = Database['public']['Tables']['parcels']['Insert'];
type ParcelUpdate = Database['public']['Tables']['parcels']['Update'];

// Use in functions
async function getParcel(id: string): Promise<Parcel> {
  const { data, error } = await supabase
    .from('parcels')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}
```

## Debugging Tips

### Enable Logging
```typescript
const supabase = createClient({
  auth: {
    debug: true,
  },
});
```

### Check RLS Policies
```sql
-- In Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'parcels';
```

### Test Query in SQL Editor
```sql
-- Test your query directly
SELECT * FROM parcels
WHERE student_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

### Check Auth User
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
console.log('Current user:', user);
console.log('User ID:', user?.id);
console.log('User email:', user?.email);
```

## Performance Tips

1. **Select only needed columns**: `.select('id, name, status')` instead of `.select('*')`
2. **Use indexes**: Already configured in schema
3. **Limit results**: Always use `.limit()` for lists
4. **Use pagination**: `.range()` for large datasets
5. **Cache with React Query**: Automatic caching and revalidation
6. **Use real-time sparingly**: Only for critical updates
7. **Batch operations**: Insert/update multiple rows at once

## Security Best Practices

1. **Never expose service role key** in client code
2. **Always use RLS policies** for data access control
3. **Validate input** on both client and server
4. **Use signed URLs** for sensitive files
5. **Implement rate limiting** for API routes
6. **Sanitize user input** before queries
7. **Use HTTPS** in production
8. **Rotate keys** periodically

## Common Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `PGRST116` | No rows returned | Check if data exists, use `.maybeSingle()` if optional |
| `23505` | Unique constraint violation | Check for duplicate values |
| `23503` | Foreign key violation | Ensure referenced record exists |
| `42501` | Insufficient privileges | Check RLS policies |
| `42P01` | Table doesn't exist | Check table name spelling |
| `22P02` | Invalid UUID | Validate UUID format |

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Real-time](https://supabase.com/docs/guides/realtime)
