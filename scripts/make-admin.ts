/**
 * Script to make a user an admin
 * Usage: npx ts-node scripts/make-admin.ts
 * 
 * This script uses the client-side Firebase SDK to update user roles.
 * You need to be logged in as an admin or have the appropriate permissions.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import * as readline from 'readline';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdminUser() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         ParcelPort Admin User Creator                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const phone = await question('Enter admin phone number: ');

    console.log('\n⏳ Creating admin user...\n');

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    console.log(`✓ User created with UID: ${uid}`);

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid: uid,
      email: email,
      name: name,
      phone: phone,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✓ User document created in Firestore');

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              ✅ Admin User Created Successfully!       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`📧 Email:    ${email}`);
    console.log(`👤 Name:     ${name}`);
    console.log(`🔑 Role:     admin`);
    console.log(`🆔 UID:      ${uid}\n`);
    console.log('You can now login with these credentials at /login\n');

  } catch (error: any) {
    console.error('\n❌ Error creating admin user:');
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('This email is already registered. Trying to update role...\n');
      const emailToUpdate = await question('Enter the email again to confirm: ');
      await updateExistingUserToAdmin(emailToUpdate);
    } else if (error.code === 'auth/weak-password') {
      console.error('Password is too weak. Please use at least 6 characters.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email address format.');
    } else {
      console.error(error.message || error);
    }
    
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function updateExistingUserToAdmin(email: string) {
  try {
    // Query Firestore to find user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('❌ User not found in database.');
      console.log('Please create a new user or check the email address.');
      return;
    }

    // Update the first matching user
    const userDoc = querySnapshot.docs[0];
    const uid = userDoc.id;

    await setDoc(doc(db, 'users', uid), {
      role: 'admin',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log('\n✅ Successfully updated user role to admin!');
    console.log(`📧 Email: ${email}`);
    console.log(`🆔 UID:   ${uid}\n`);
    console.log('The user needs to sign out and sign in again for changes to take effect.\n');

  } catch (error: any) {
    console.error('❌ Error updating user:', error.message || error);
    throw error;
  }
}

async function makeExistingUserAdmin() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         Update Existing User to Admin                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const email = await question('Enter user email to make admin: ');

    console.log('\n⏳ Updating user role...\n');

    await updateExistingUserToAdmin(email);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function main() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              ParcelPort Admin Manager                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('Choose an option:\n');
    console.log('1. Create new admin user');
    console.log('2. Make existing user admin');
    console.log('3. Exit\n');

    const choice = await question('Enter your choice (1-3): ');

    switch (choice.trim()) {
      case '1':
        await createAdminUser();
        break;
      case '2':
        await makeExistingUserAdmin();
        break;
      case '3':
        console.log('\nExiting...\n');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('\n❌ Invalid choice. Please run the script again.\n');
        rl.close();
        process.exit(1);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Unexpected error:', error.message || error);
    rl.close();
    process.exit(1);
  }
}

// Run the script
main();
