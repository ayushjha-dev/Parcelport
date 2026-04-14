'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, Truck, CheckCircle, Wallet } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export default function AdminDashboardPage() {
  const stats = [
    { icon: Package, label: "Today's Parcels", value: '0', badge: 'No data', color: 'bg-[#d9e2ff]', textColor: 'text-[#04122e]' },
    { icon: Clock, label: 'Pending Verification', value: '0', badge: 'No data', color: 'bg-[#ffddb8]', textColor: 'text-[#855300]' },
    { icon: Truck, label: 'Out for Delivery', value: '0', badge: 'No data', color: 'bg-amber-100', textColor: 'text-amber-700' },
    { icon: CheckCircle, label: 'Delivered Today', value: '0', badge: 'No data', color: 'bg-green-100', textColor: 'text-green-700' },
    { icon: Wallet, label: 'Revenue Today', value: '₹0', badge: 'No data', color: 'bg-[#fea619]', textColor: 'text-white' },
  ];

  const pendingPayments: Array<never> = [];

  return (
    <div className="min-h-screen">
      <TopBar title="Admin Dashboard" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} showSearch showExportButton />
      
      <div className="pt-28 pb-12 px-10 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className={`p-6 rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.03)] border border-[#c5c6ce]/10 ${
              i === 4 ? stat.color : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${i === 4 ? 'bg-white/20' : stat.color} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${i === 4 ? 'text-white' : stat.textColor}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  i === 4 ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                }`}>
                  {stat.badge}
                </span>
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${i === 4 ? 'text-white' : 'text-[#04122e]'}`}>{stat.value}</p>
                <p className={`text-xs font-bold uppercase tracking-wider ${i === 4 ? 'text-white/80' : 'text-[#45464d]'}`}>
                  {stat.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Parcels Needing Attention */}
        <Card className="rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.03)] border border-[#c5c6ce]/10 overflow-hidden">
          <div className="p-6 border-b border-[#eaeef2] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#04122e]">Parcels Needing Attention</h2>
              <p className="text-sm text-[#45464d]">Immediate action required for payment verification</p>
            </div>
            <div className="flex bg-[#f0f4f8] p-1 rounded-lg">
              <Button 
                type="button"
                size="sm" 
                className="bg-white text-xs font-bold rounded-md shadow-sm"
              >
                Payment Pending
              </Button>
              <Button 
                type="button"
                size="sm" 
                variant="ghost" 
                className="text-xs font-bold"
              >
                Failed
              </Button>
              <Button 
                type="button"
                size="sm" 
                variant="ghost" 
                className="text-xs font-bold"
              >
                Rejected
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f4f8]/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Student</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">DRID / Courier</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Method</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Proof</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeef2]">
                {pendingPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <EmptyState title="No payments to review" description="Pending payment proofs will appear here when available." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
