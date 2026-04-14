/**
 * Reset Admin Password Script
 * Run with: node reset-admin-password.js
 */

const crypto = require('crypto');

// Function to hash password (same as in the app)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Set your new password here
const NEW_PASSWORD = 'admin123';
const ADMIN_EMAIL = 'sanataniayushjha07@gmail.com';

const hashedPassword = hashPassword(NEW_PASSWORD);

console.log('\n=== ADMIN PASSWORD RESET ===\n');
console.log('Email:', ADMIN_EMAIL);
console.log('New Password:', NEW_PASSWORD);
console.log('Hashed Password:', hashedPassword);
console.log('\nRun this SQL in Supabase SQL Editor:\n');
console.log(`UPDATE profiles SET password_hash = '${hashedPassword}' WHERE email = '${ADMIN_EMAIL}';`);
console.log('\nOr use the Supabase MCP tool to run the update.\n');
