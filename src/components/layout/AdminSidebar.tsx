'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package2, LayoutDashboard, Package, CreditCard, Users, TrendingUp, Truck, UserPlus, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleProfileClick = () => {
    router.push('/admin/profile');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
    { href: '/admin/parcels', icon: Package, label: 'Parcels', badge: null },
    { href: '/admin/payments', icon: CreditCard, label: 'Payments', badge: null },
    { href: '/admin/assign', icon: Truck, label: 'Assign Delivery', badge: null },
    { href: '/admin/revenue', icon: TrendingUp, label: 'Revenue', badge: null },
    { href: '/admin/create-admin', icon: UserPlus, label: 'Create New Admin', badge: null },
    { href: '/admin/delivery-boys', icon: Users, label: 'List of Delivery Boys', badge: null },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#04122e] flex flex-col py-6 gap-2 font-['Plus_Jakarta_Sans'] shadow-[20px_0_40px_rgba(4,18,46,0.06)] z-50">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Package2 className="text-[#04122e] w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ParcelPort</span>
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold opacity-80">
          Admin Panel
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-2 px-4 py-3 flex items-center ${
                item.badge ? 'justify-between' : 'gap-3'
              } rounded-lg transition-transform ${
                isActive
                  ? 'bg-white/10 text-white font-semibold scale-95 active:scale-90'
                  : 'text-slate-400 hover:text-white transition-colors'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 opacity-90" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-[#855300] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 mt-auto">
        <button
          type="button"
          onClick={handleProfileClick}
          className="w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 flex items-center gap-3 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center text-white font-bold text-sm">
            {(user?.email ?? 'A').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-sm font-semibold text-white truncate">{user?.email ?? 'Admin account'}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">View Profile</p>
          </div>
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </aside>
  );
}
