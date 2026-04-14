// Firebase Admin SDK
// Optional - for server-side operations
// Install firebase-admin if you need this: pnpm add firebase-admin

let admin: any = null;

try {
  // Only import if available - not all projects need admin SDK
  const adminModule = require('firebase-admin');
  admin = adminModule;
  
  if (!admin.apps || admin.apps.length === 0) {
    if (process.env.FIREBASE_ADMIN_SDK_KEY) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
        });
      } catch (error) {
        console.warn('Failed to initialize Firebase Admin SDK:', error);
      }
    }
  }
} catch (error) {
  // Admin SDK not installed - this is optional
  console.warn('Firebase Admin SDK not available. Install it with: pnpm add firebase-admin');
}

export const adminAuth = admin?.auth?.() || null;
export const adminDb = admin?.firestore?.() || null;

export default admin;
