'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface RevenueStats {
  today: { amount: number; count: number };
  thisWeek: { amount: number; count: number };
  thisMonth: { amount: number; count: number };
  total: { amount: number; count: number };
}

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<RevenueStats>({
    today: { amount: 0, count: 0 },
    thisWeek: { amount: 0, count: 0 },
    thisMonth: { amount: 0, count: 0 },
    total: { amount: 0, count: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const parcelsRef = collection(db, 'parcels');
        
        // Get all parcels with payment status
        const q = query(parcelsRef, where('paymentStatus', '==', 'paid'));
        const querySnapshot = await getDocs(q);

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        let todayAmount = 0, todayCount = 0;
        let weekAmount = 0, weekCount = 0;
        let monthAmount = 0, monthCount = 0;
        let totalAmount = 0, totalCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const amount = data.amount || 10; // Default ₹10 per parcel
          const createdAt = data.createdAt?.toDate() || new Date();

          totalAmount += amount;
          totalCount++;

          if (createdAt >= todayStart) {
            todayAmount += amount;
            todayCount++;
          }

          if (createdAt >= weekStart) {
            weekAmount += amount;
            weekCount++;
          }

          if (createdAt >= monthStart) {
            monthAmount += amount;
            monthCount++;
          }
        });

        setStats({
          today: { amount: todayAmount, count: todayCount },
          thisWeek: { amount: weekAmount, count: weekCount },
          thisMonth: { amount: monthAmount, count: monthCount },
          total: { amount: totalAmount, count: totalCount },
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const statsData = [
    { label: 'Today', value: `₹${stats.today.amount}`, parcels: `${stats.today.count} parcels` },
    { label: 'This Week', value: `₹${stats.thisWeek.amount}`, parcels: `${stats.thisWeek.count} parcels` },
    { label: 'This Month', value: `₹${stats.thisMonth.amount}`, parcels: `${stats.thisMonth.count} parcels` },
    { label: 'Total', value: `₹${stats.total.amount}`, parcels: `${stats.total.count} parcels` },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Revenue Reports" subtitle="Financial overview and analytics" showExportButton />
      
      <div className="pt-28 pb-12 px-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsData.map((stat, i) => (
            <Card key={i} className="p-6 rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.03)] border border-[#c5c6ce]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#d9e2ff] flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#04122e]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#45464d]">{stat.label}</span>
              </div>
              {loading ? (
                <p className="text-3xl font-extrabold text-[#04122e] mb-1">...</p>
              ) : (
                <>
                  <p className="text-3xl font-extrabold text-[#04122e] mb-1">{stat.value}</p>
                  <p className="text-xs text-[#45464d]">{stat.parcels}</p>
                </>
              )}
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl p-8 shadow-[0_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10">
          <h2 className="text-xl font-bold text-[#04122e] mb-6">Revenue Trend</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-[#45464d]">Loading chart data...</p>
            </div>
          ) : stats.total.count === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-[#45464d]">No revenue data available yet</p>
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-4">
              {[45, 62, 58, 73, 81, 69, 92].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#04122e] rounded-t-lg transition-all hover:bg-[#1a2744]" style={{ height: `${height}%` }}></div>
                  <span className="text-xs text-[#45464d] font-medium">Day {i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
