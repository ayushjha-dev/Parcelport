'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin' | 'delivery_boy';
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo = '/login' }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check role if required
      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (user?.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user?.role === 'delivery_boy') {
          router.push('/delivery/dashboard');
        } else if (user?.role === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/login');
        }
      }
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#04122e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#45464d]">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Wrong role
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
