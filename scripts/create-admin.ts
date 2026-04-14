/**
 * Script to create an admin user
 * 
 * Usage:
 * 1. Set your Supabase credentials in .env.local
 * 2. Run: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Simple password hashing (same as in the app)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('=== Create Admin User ===\n');

  // Get Supabase credentials from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get admin details
  const fullName = await question('Full Name: ');
  const email = await question('Email: ');
  const mobile = await question('Mobile Number (10 digits): ');
  const password = await question('Password (min 6 characters): ');

  if (!fullName || !email || !mobile || password.length < 6) {
    console.error('\nError: All fields are required and password must be at least 6 characters');
    rl.close();
    process.exit(1);
  }

  // Validate mobile number
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    console.error('\nError: Invalid mobile number. Must be 10 digits starting with 6-9');
    rl.close();
    process.exit(1);
  }

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      console.error('\nError: Email already exists');
      rl.close();
      process.exit(1);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate UUID
    const userId = crypto.randomUUID();

    // Create admin profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email.toLowerCase(),
        full_name: fullName,
        mobile_number: `+91${mobile}`,
        role: 'admin',
        password_hash: passwordHash,
        is_active: true,
        mobile_verified: false,
      });

    if (error) {
      console.error('\nError creating admin:', error.message);
      rl.close();
      process.exit(1);
    }

    console.log('\n✅ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`You can now login at /login with role "Admin"`);
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
