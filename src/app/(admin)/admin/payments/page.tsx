'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';

export default function AdminPaymentsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Payment Verification" subtitle="Review and approve payment proofs" showSearch />
      
      <div className="pt-28 pb-12 px-10">
        <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10">
          <div className="p-6 border-b border-[#eaeef2]">
            <h2 className="text-xl font-bold text-[#04122e]">Pending Verifications</h2>
          </div>
          <div className="p-6">
            <EmptyState title="No pending verifications" description="Payment review items will appear here once live records are available." />
          </div>
        </Card>
      </div>
    </div>
  );
}
