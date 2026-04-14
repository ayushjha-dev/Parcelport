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
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        setIsAuthorized(false);
        router.replace('/login');
        return;
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        setIsAuthorized(false);
        toast.error('You do not have permission to access this page.');
        
        // Redirect to appropriate dashboard
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else if (user.role === 'delivery_boy') {
          router.replace('/delivery/dashboard');
        } else if (user.role === 'student') {
          router.replace('/student/dashboard');
        } else {
          router.replace('/login');
        }
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, loading, allowedRoles, router]);

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
