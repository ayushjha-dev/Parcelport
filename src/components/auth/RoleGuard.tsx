'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { UserRole } from '@/types/database';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        setIsAuthorized(false);
        router.replace('/login');
        return;
      }

      // No profile found
      if (!profile) {
        setIsAuthorized(false);
        toast.error('User profile not found. Please sign in again.');
        router.replace('/login');
        return;
      }

      // Check if user has required role
      if (!allowedRoles.includes(profile.role)) {
        setIsAuthorized(false);
        toast.error('You do not have permission to access this page.');
        
        // Redirect to appropriate dashboard
        if (profile.role === 'admin') {
          router.replace('/admin/dashboard');
        } else if (profile.role === 'delivery_boy') {
          router.replace('/delivery/dashboard');
        } else if (profile.role === 'student') {
          router.replace('/student/dashboard');
        } else {
          router.replace('/login');
        }
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, profile, loading, allowedRoles, router]);

  if (loading) {
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
