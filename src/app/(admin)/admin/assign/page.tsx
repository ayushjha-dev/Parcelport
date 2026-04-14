'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';

export default function AssignDeliveryPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Assign Delivery Boys" subtitle="Assign parcels to delivery personnel" showSearch />
      
      <div className="pt-28 pb-12 px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Unassigned Parcels */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10">
              <div className="p-6 border-b border-[#eaeef2]">
                <h2 className="text-xl font-bold text-[#04122e]">Unassigned Parcels</h2>
              </div>
              <div className="p-6">
                <EmptyState
                  title="No parcels to assign"
                  description="Unassigned parcels will appear here when they are ready for dispatch."
                />
              </div>
            </Card>
          </div>

          {/* Delivery Boys Status */}
          <div>
            <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10 p-6">
              <h3 className="text-lg font-bold text-[#04122e] mb-6">Delivery Boys</h3>
              <EmptyState title="No delivery staff loaded" description="Delivery personnel data will appear here once connected to the database." />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
