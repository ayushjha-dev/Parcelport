'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';

export default function DeliveryDashboardPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Today's Deliveries" subtitle="0 parcels assigned" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="p-6 rounded-xl bg-[#d9e2ff] border-[#d9e2ff]">
              <p className="text-sm font-bold text-[#3a4665] mb-2">Total Assigned</p>
              <p className="text-3xl font-extrabold text-[#04122e]">0</p>
            </Card>
            <Card className="p-6 rounded-xl bg-amber-100 border-amber-100">
              <p className="text-sm font-bold text-amber-800 mb-2">In Progress</p>
              <p className="text-3xl font-extrabold text-amber-900">0</p>
            </Card>
            <Card className="p-6 rounded-xl bg-green-100 border-green-100">
              <p className="text-sm font-bold text-green-800 mb-2">Completed</p>
              <p className="text-3xl font-extrabold text-green-900">0</p>
            </Card>
          </div>

          <h2 className="text-xl font-bold text-[#04122e] mb-4">Assigned Parcels</h2>
          <EmptyState
            title="No deliveries assigned"
            description="Assigned parcels will appear here when dispatch starts for your account."
          />
        </div>
      </div>
    </div>
  );
}
