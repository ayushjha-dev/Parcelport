import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SessionUser } from '@/lib/auth/session';

export function useAuth(requiredRole?: string) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);

      // Check role if required
      if (requiredRole && data.user.role !== requiredRole) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, loading, logout };
}
