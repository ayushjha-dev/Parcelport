'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { UserRole } from '@/types/database';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
          setIsAuthorized(false);
          await signOut(auth);
          toast.error('User profile not found. Please sign in again.');
          router.replace('/login');
          return;
        }

        const role = userDoc.data().role as UserRole;

        if (!allowedRoles.includes(role)) {
          setIsAuthorized(false);
          await signOut(auth);
          toast.error('You do not have permission to access this page.');
          router.replace('/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth guard error:', error);
        setIsAuthorized(false);
        toast.error('Unable to verify your session. Please login again.');
        router.replace('/login');
      } finally {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [allowedRoles, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fafe]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
