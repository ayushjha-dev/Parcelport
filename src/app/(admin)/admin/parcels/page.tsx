'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Parcel {
  id: string;
  drid: string;
  student_name: string;
  student_roll_no: string;
  student_email: string;
  student_mobile: string;
  hostel_block: string;
  floor_number: string;
  room_number: string;
  courier_company: string;
  parcel_awb: string;
  status: string;
  created_at: string;
}

export default function AdminParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchParcels();
  }, []);

  useEffect(() => {
    filterParcels();
  }, [searchQuery, statusFilter, parcels]);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/parcels');
      const data = await response.json();
      if (data.success) {
        setParcels(data.data || []);
      } else {
        toast.error(data.error || 'Failed to load parcels');
      }
    } catch (error) {
      console.error('Error fetching parcels:', error);
      toast.error('Failed to load parcels');
    } finally {
      setLoading(false);
    }
  };

  const filterParcels = () => {
    let filtered = parcels;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.drid?.toLowerCase().includes(query) ||
        p.student_name?.toLowerCase().includes(query) ||
        p.student_roll_no?.toLowerCase().includes(query) ||
        p.student_email?.toLowerCase().includes(query)
      );
    }

    setFilteredParcels(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
      payment_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      payment_verified: { bg: 'bg-green-100', text: 'text-green-700' },
      assigned: { bg: 'bg-purple-100', text: 'text-purple-700' },
      out_for_delivery: { bg: 'bg-orange-100', text: 'text-orange-700' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700' },
      failed_delivery: { bg: 'bg-red-100', text: 'text-red-700' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <TopBar title="All Parcels" subtitle="Master parcel registry" showSearch showExportButton />
      
      <div className="pt-28 pb-12 px-10">
        <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10">
          <div className="p-6 border-b border-[#eaeef2]">
            <div className="mb-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45464d] w-4 h-4" />
                <Input 
                  className="pl-12 bg-[#f0f4f8] border-none rounded-xl" 
                  placeholder="Search by DRID, name, roll number, or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-[#f0f4f8] border-none rounded-xl text-sm font-bold text-[#04122e]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="payment_verified">Payment Verified</option>
                <option value="assigned">Assigned</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed_delivery">Failed Delivery</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <p className="text-sm text-[#45464d]">
              Showing {filteredParcels.length} of {parcels.length} parcels
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-[#45464d]">Loading parcels...</div>
          ) : filteredParcels.length === 0 ? (
            <div className="p-6">
              <EmptyState 
                title={searchQuery || statusFilter !== 'all' ? 'No parcels match your filters' : 'No parcels available'} 
                description={searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Parcel records will appear here when students submit parcels.'} 
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f0f4f8]/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">DRID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Student</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Location</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Courier</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#45464d]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeef2]">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-[#f0f4f8]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#04122e]">{parcel.drid}</div>
                        <div className="text-xs text-[#45464d]">{parcel.parcel_awb}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#04122e]">{parcel.student_name}</div>
                        <div className="text-xs text-[#45464d]">{parcel.student_roll_no}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#04122e]">
                          Block {parcel.hostel_block}, Floor {parcel.floor_number}, Room {parcel.room_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold uppercase">{parcel.courier_company}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(parcel.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#45464d]">
                          {new Date(parcel.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
