'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Payment {
  id: string;
  delivery_fee_amount: string;
  delivery_fee_method: string;
  delivery_fee_transaction_id: string;
  delivery_fee_screenshot_url: string;
  delivery_fee_status: string;
  created_at: string;
  parcels: {
    drid: string;
    student_name: string;
    student_email: string;
    student_mobile: string;
    courier_company: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/payments?status=${filter}`);
      const data = await response.json();
      if (data.success) {
        setPayments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
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
      } else {
        toast.error(data.error || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Payment Verification" subtitle="Review and approve payment proofs" showSearch />
      
      <div className="pt-28 pb-12 px-10">
        <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10">
          <div className="p-6 border-b border-[#eaeef2] flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#04122e]">Payment Verifications</h2>
            <div className="flex bg-[#f0f4f8] p-1 rounded-lg gap-1">
              <Button 
                type="button"
                size="sm" 
                onClick={() => setFilter('pending')}
                className={`text-xs font-bold rounded-md transition-all ${
                  filter === 'pending' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
              >
                Pending
              </Button>
              <Button 
                type="button"
                size="sm" 
                onClick={() => setFilter('verified')}
                className={`text-xs font-bold rounded-md transition-all ${
                  filter === 'verified' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
              >
                Verified
              </Button>
              <Button 
                type="button"
                size="sm" 
                onClick={() => setFilter('rejected')}
                className={`text-xs font-bold rounded-md transition-all ${
                  filter === 'rejected' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
              >
                Rejected
              </Button>
              <Button 
                type="button"
                size="sm" 
                onClick={() => setFilter('all')}
                className={`text-xs font-bold rounded-md transition-all ${
                  filter === 'all' 
                    ? 'bg-white text-[#04122e] shadow-sm' 
                    : 'bg-transparent text-[#45464d] hover:bg-white/50'
                }`}
              >
                All
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-[#45464d]">Loading...</div>
            ) : payments.length === 0 ? (
              <div className="p-6">
                <EmptyState 
                  title={`No ${filter === 'all' ? '' : filter} payments`} 
                  description="Payment records will appear here when available." 
                />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#f0f4f8]/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Student</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">DRID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Transaction ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Proof</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeef2]">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#f0f4f8]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#04122e]">{payment.parcels?.student_name}</div>
                        <div className="text-xs text-[#45464d]">{payment.parcels?.student_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#04122e]">{payment.parcels?.drid}</div>
                        <div className="text-xs text-[#45464d]">{payment.parcels?.courier_company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#04122e]">₹{payment.delivery_fee_amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase">{payment.delivery_fee_method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#45464d]">{payment.delivery_fee_transaction_id || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.delivery_fee_screenshot_url ? (
                          <a 
                            href={payment.delivery_fee_screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-[#45464d]">No screenshot</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          payment.delivery_fee_status === 'verified' ? 'bg-green-100 text-green-700' :
                          payment.delivery_fee_status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payment.delivery_fee_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {payment.delivery_fee_status === 'pending' && (
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
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
