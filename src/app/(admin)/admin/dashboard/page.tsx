'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, Truck, CheckCircle, Wallet } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Stats {
  todayParcels: number;
  pendingVerification: number;
  outForDelivery: number;
  deliveredToday: number;
  revenueToday: number;
}

interface Payment {
  id: string;
  delivery_fee_method: string;
  delivery_fee_screenshot_url: string;
  delivery_fee_status: string;
  parcels: {
    drid: string;
    student_name: string;
    courier_company: string;
  };
}

export default function AdminDashboardPage() {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [activeFilter]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`/api/admin/payments?status=${activeFilter}`);
      const data = await response.json();
      if (data.success) {
        setPayments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/approve`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Payment approved successfully');
        fetchPayments();
        fetchData();
      } else {
        toast.error(data.error || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Payment rejected');
        fetchPayments();
        fetchData();
      } else {
        toast.error(data.error || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const statsData = [
    { icon: Package, label: "Today's Parcels", value: stats?.todayParcels?.toString() || '0', badge: stats ? 'Live' : 'Loading', color: 'bg-[#d9e2ff]', textColor: 'text-[#04122e]' },
    { icon: Clock, label: 'Pending Verification', value: stats?.pendingVerification?.toString() || '0', badge: stats ? 'Live' : 'Loading', color: 'bg-[#ffddb8]', textColor: 'text-[#855300]' },
    { icon: Truck, label: 'Out for Delivery', value: stats?.outForDelivery?.toString() || '0', badge: stats ? 'Live' : 'Loading', color: 'bg-amber-100', textColor: 'text-amber-700' },
    { icon: CheckCircle, label: 'Delivered Today', value: stats?.deliveredToday?.toString() || '0', badge: stats ? 'Live' : 'Loading', color: 'bg-green-100', textColor: 'text-green-700' },
    { icon: Wallet, label: 'Revenue Today', value: `₹${stats?.revenueToday || 0}`, badge: stats ? 'Live' : 'Loading', color: 'bg-[#fea619]', textColor: 'text-white' },
  ];

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'pending':
        return {
          title: 'No payments to review',
          description: 'Pending payment proofs will appear here when students submit payments.'
        };
      case 'verified':
        return {
          title: 'No verified payments',
          description: 'Approved payment transactions will appear here.'
        };
      case 'rejected':
        return {
          title: 'No rejected payments',
          description: 'Rejected payment proofs will appear here.'
        };
    }
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="min-h-screen">
      <TopBar title="Admin Dashboard" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} showSearch showExportButton />
      
      <div className="pt-28 pb-12 px-10 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statsData.map((stat, i) => (
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
            <div className="flex bg-[#f0f4f8] p-1 rounded-lg gap-1">
              <Button 
                type="button"
                size="sm" 
                onClick={() => setActiveFilter('pending')}
                className={`text-xs font-bold rounded-md transition-all ${
                  activeFilter === 'pending' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
              >
                Payment Pending
              </Button>
              <Button 
                type="button"
                size="sm" 
                onClick={() => setActiveFilter('verified')}
                className={`text-xs font-bold rounded-md transition-all ${
                  activeFilter === 'verified' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
              >
                Verified
              </Button>
              <Button 
                type="button"
                size="sm" 
                onClick={() => setActiveFilter('rejected')}
                className={`text-xs font-bold rounded-md transition-all ${
                  activeFilter === 'rejected' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
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
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <EmptyState 
                        title={emptyState.title} 
                        description={emptyState.description} 
                      />
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#f0f4f8]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#04122e]">{payment.parcels?.student_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#04122e]">{payment.parcels?.drid}</div>
                        <div className="text-xs text-[#45464d]">{payment.parcels?.courier_company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase">{payment.delivery_fee_method}</span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.delivery_fee_screenshot_url ? (
                          <a 
                            href={payment.delivery_fee_screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Screenshot
                          </a>
                        ) : (
                          <span className="text-xs text-[#45464d]">No screenshot</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {activeFilter === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleApprove(payment.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleReject(payment.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
