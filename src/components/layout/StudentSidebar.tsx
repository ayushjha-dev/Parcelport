'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package2, LayoutDashboard, Package, Bell, User, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function StudentSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await logout();
    setIsSigningOut(false);
  };

  const navItems = [
    { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/student/parcels', icon: Package, label: 'My Parcels' },
    { href: '/student/track', icon: Package2, label: 'Track Delivery' },
    { href: '/student/notifications', icon: Bell, label: 'Notifications' },
    { href: '/student/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#04122e] flex flex-col py-8 px-4 font-['Plus_Jakarta_Sans'] shadow-[20px_0_40px_rgba(4,18,46,0.06)] z-50">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Package2 className="text-[#04122e] w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-widest uppercase">ParcelPort</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white/10 text-white scale-[0.98]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Footer */}
      <div className="mt-auto px-4 border-t border-white/5 pt-6">
        <nav className="space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors text-sm w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
