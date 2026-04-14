'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Search, Calendar, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function MyParcelsPage() {
  const { user } = useAuth();
  const [parcelCounts, setParcelCounts] = useState({
    all: 0,
    active: 0,
    paymentPending: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcelCounts = async () => {
      if (!user) return;

      try {
        // TODO: Implement API call to fetch parcel counts
        // For now, using placeholder data
        setParcelCounts({
          all: 0,
          active: 0,
          paymentPending: 0,
          delivered: 0,
        });
      } catch (error) {
        console.error('Error fetching parcel counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParcelCounts();
  }, [user]);

  return (
    <div className="min-h-screen">
      <TopBar title="My Parcels" subtitle="All your registered parcel requests" showSearch={false} />
      
      <div className="pt-24 px-10 pb-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1a2744] tracking-tight">My Parcels</h2>
            <p className="text-[#64748b] font-medium mt-1">All your registered parcel requests</p>
          </div>
          <Link href="/student/parcels/new/step-1">
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#1a2744] font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20">
              <Plus className="w-5 h-5" />
              Register New Parcel
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <Card className="border border-[#c5c6ce]/15 rounded-2xl p-4 flex flex-wrap items-center gap-4 mb-6 shadow-sm">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45464d] w-4 h-4" />
            <Input
              className="w-full pl-12 pr-4 py-2.5 bg-[#f0f4f8] border-none rounded-xl text-sm font-medium"
              placeholder="Search by DRID, Parcel ID, Courier..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Select>
              <SelectTrigger className="bg-[#f0f4f8] border-none rounded-xl text-sm font-medium min-w-[140px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Payment Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-[#f0f4f8] border-none rounded-xl text-sm font-medium min-w-[140px]">
                <SelectValue placeholder="All Couriers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Couriers</SelectItem>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="flipkart">Flipkart</SelectItem>
                <SelectItem value="bluedart">BlueDart</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-none bg-[#f0f4f8] rounded-xl text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>
          <Button variant="ghost" className="text-[#45464d] hover:text-[#04122e] font-semibold text-sm">
            Reset Filters
          </Button>
        </Card>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Button className="bg-[#1a2744] text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-md">
            All <span className="bg-white/20 px-2 rounded-full text-[11px]">{loading ? '...' : parcelCounts.all}</span>
          </Button>
          <Button variant="outline" className="bg-[#f0f4f8] text-[#45464d] border-none px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            Active <span className="bg-[#45464d]/10 px-2 rounded-full text-[11px]">{loading ? '...' : parcelCounts.active}</span>
          </Button>
          <Button variant="outline" className="bg-[#f0f4f8] text-[#45464d] border-none px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            Payment Pending <span className="bg-[#45464d]/10 px-2 rounded-full text-[11px]">{loading ? '...' : parcelCounts.paymentPending}</span>
          </Button>
          <Button variant="outline" className="bg-[#f0f4f8] text-[#45464d] border-none px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            Delivered <span className="bg-[#45464d]/10 px-2 rounded-full text-[11px]">{loading ? '...' : parcelCounts.delivered}</span>
          </Button>
        </div>

        {/* Parcels Table */}
        <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10 p-8">
          <EmptyState
            title="No parcel records yet"
            description="Your parcel history will appear here after you register or receive your first delivery."
            action={<Link href="/student/parcels/new/step-1"><Button className="bg-[#f59e0b] text-[#1a2744]">Register New Parcel</Button></Link>}
          />
        </Card>
      </div>
    </div>
  );
}
