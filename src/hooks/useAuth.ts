import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/client';
import { User, onAuthStateChanged, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUserProfile = async (data: {
    displayName?: string;
    mobile?: string;
    room?: string;
  }) => {
    if (!user) throw new Error('No user logged in');

    try {
      // Update Firebase Auth profile
      if (data.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        });
      }

      // Store additional data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        displayName: data.displayName || user.displayName,
        mobile: data.mobile || '',
        room: data.room || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Refresh user state
      setUser({ ...user });
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const getUserProfile = async () => {
    if (!user) return null;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  return { user, loading, signOut, updateUserProfile, getUserProfile };
}
