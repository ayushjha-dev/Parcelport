'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Package, CreditCard, CheckCircle, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { EmptyState } from '@/components/shared/EmptyState';
import { useRouter } from 'next/navigation';

export default function StudentDashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';
  const stats = [
    { icon: Package, label: 'Active Parcels', value: '0', change: 'No parcel data yet', color: 'bg-[#d9e2ff]', textColor: 'text-[#04122e]' },
    { icon: CreditCard, label: 'Awaiting Payment', value: '0', change: 'No pending charges', color: 'bg-[#ffdad6]', textColor: 'text-[#ba1a1a]' },
    { icon: CheckCircle, label: 'Delivered This Month', value: '0', change: 'Nothing delivered yet', color: 'bg-[#d3e4fe]', textColor: 'text-[#031427]' },
    { icon: Wallet, label: 'Total Spent', value: '₹0', change: 'No transactions yet', color: 'bg-[#ffddb8]', textColor: 'text-[#855300]' },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Student Dashboard" showSearch showRegisterButton />
      
      <div className="pt-28 pb-12 px-10 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <p className="text-[#45464d] text-xs font-medium uppercase tracking-[0.2em]">Academic Concierge Service</p>
          <div className="flex items-end gap-3">
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-[#04122e] tracking-tight">
              Good morning, {displayName} 👋
            </h1>
            <span className="mb-1 text-sm font-medium text-[#45464d] bg-[#eaeef2] px-3 py-1 rounded-full">
              Your profile details will appear here once configured
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 rounded-3xl shadow-[0px_20px_40px_rgba(4,18,46,0.04)] hover:translate-y-[-4px] transition-all duration-300 border-[#c5c6ce]/10">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <p className="text-[#45464d] text-sm font-medium mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-[#04122e]">{stat.value}</h3>
                {stat.change && <span className="text-xs font-bold text-[#855300]">{stat.change}</span>}
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Parcels */}
        <Card className="rounded-3xl shadow-[0px_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border-[#c5c6ce]/10">
          <div className="px-8 py-6 border-b border-[#eaeef2] flex justify-between items-center">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#04122e]">Recent Arrivals</h2>
            <Button 
              variant="link" 
              className="text-[#04122e] font-bold"
              onClick={() => router.push('/student/parcels')}
            >
              View All Records
            </Button>
          </div>
          <div className="p-8">
            <EmptyState
              title="No parcels yet"
              description="Your recent parcel activity will appear here after you register your first parcel or receive a delivery."
              action={
                <Button 
                  className="bg-[#04122e] text-white"
                  onClick={() => router.push('/student/parcels/new/step-1')}
                >
                  Register New Parcel
                </Button>
              }
            />
          </div>
        </Card>

        {/* Next Delivery Card */}
        <Card className="bg-amber-50 rounded-3xl p-6 border border-amber-100/50">
          <div className="flex items-center justify-between mb-6">
            <span className="text-amber-800 font-bold text-sm tracking-wide uppercase">Next Delivery</span>
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Priority</span>
          </div>
          <EmptyState
            title="No active delivery"
            description="Tracking details will appear here when a parcel is assigned to you."
            action={
              <Button 
                className="w-full bg-[#04122e] hover:bg-[#1a2744] text-white font-bold rounded-xl"
                onClick={() => router.push('/student/parcels')}
              >
                Go to My Parcels
              </Button>
            }
          />
        </Card>
      </div>
    </div>
  );
}
