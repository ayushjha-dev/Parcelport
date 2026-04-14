#!/usr/bin/env node

/**
 * Automated CORS Fix Script for Firebase Storage
 * 
 * This script will guide you through fixing the CORS issue.
 * Run: node fix-cors.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     Firebase Storage CORS Fix - Automated Script      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Read Firebase config from .env.local
const envPath = path.join(__dirname, '.env.local');
let projectId = 'parcelport-499d4';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const projectMatch = envContent.match(/NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.+)/);
  if (projectMatch) {
    projectId = projectMatch[1].trim();
  }
}

console.log(`📦 Project ID: ${projectId}`);
console.log(`🪣 Bucket: ${projectId}.appspot.com\n`);

// Check if gsutil is installed
console.log('🔍 Checking for Google Cloud SDK...\n');

try {
  execSync('gsutil version', { stdio: 'ignore' });
  console.log('✅ Google Cloud SDK is installed!\n');
} catch (error) {
  console.log('❌ Google Cloud SDK (gsutil) is not installed.\n');
  console.log('📥 Please install it first:\n');
  console.log('   Windows: https://cloud.google.com/sdk/docs/install#windows');
  console.log('   Mac: brew install google-cloud-sdk');
  console.log('   Linux: curl https://sdk.cloud.google.com | bash\n');
  console.log('After installation, run: gcloud auth login\n');
  process.exit(1);
}

// Check if authenticated
console.log('🔐 Checking authentication...\n');

try {
  execSync('gcloud auth list', { stdio: 'ignore' });
  console.log('✅ You are authenticated!\n');
} catch (error) {
  console.log('❌ Not authenticated with Google Cloud.\n');
  console.log('Please run: gcloud auth login\n');
  process.exit(1);
}

// Create CORS configuration
console.log('📝 Creating CORS configuration...\n');

const corsConfig = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    maxAgeSeconds: 3600,
    responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'X-Requested-With']
  }
];

fs.writeFileSync('cors-temp.json', JSON.stringify(corsConfig, null, 2));
console.log('✅ CORS configuration created!\n');

// Apply CORS configuration
console.log('🚀 Applying CORS configuration to Firebase Storage...\n');

try {
  const bucketName = `gs://${projectId}.appspot.com`;
  execSync(`gsutil cors set cors-temp.json ${bucketName}`, { stdio: 'inherit' });
  console.log('\n✅ CORS configuration applied successfully!\n');
} catch (error) {
  console.log('\n❌ Failed to apply CORS configuration.');
  console.log('Please make sure you have the correct permissions.\n');
  fs.unlinkSync('cors-temp.json');
  process.exit(1);
}

// Verify CORS configuration
console.log('🔍 Verifying CORS configuration...\n');

try {
  const bucketName = `gs://${projectId}.appspot.com`;
  execSync(`gsutil cors get ${bucketName}`, { stdio: 'inherit' });
  console.log('\n✅ CORS configuration verified!\n');
} catch (error) {
  console.log('\n⚠️  Could not verify CORS configuration, but it may have been applied.\n');
}

// Cleanup
fs.unlinkSync('cors-temp.json');

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║                  ✅ ALL DONE!                          ║');
console.log('╚════════════════════════════════════════════════════════╝\n');
console.log('🎉 CORS has been configured for your Firebase Storage!\n');
console.log('📝 Next steps:');
console.log('   1. Wait 2-3 minutes for changes to propagate');
console.log('   2. Clear your browser cache');
console.log('   3. Test the upload at: https://parcelport.vercel.app/student/parcels/new/step-4\n');
console.log('💡 If you still see CORS errors, try:');
console.log('   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)');
console.log('   - Open in incognito/private window\n');
