'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryBoysPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Delivery Boy Management" subtitle="Manage delivery personnel" showSearch />
      
      <div className="pt-28 pb-12 px-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#04122e]">All Delivery Boys</h2>
          <Link href="/admin/delivery-boys/create">
            <Button className="bg-[#04122e] hover:bg-[#1a2744] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" />
              Create New Account
            </Button>
          </Link>
        </div>

        <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10 p-8">
          <EmptyState 
            title="No delivery staff loaded" 
            description="Delivery personnel records will appear here when they are connected from your data source."
            action={
              <Link href="/admin/delivery-boys/create">
                <Button className="bg-[#04122e] text-white">
                  Create First Account
                </Button>
              </Link>
            }
          />
        </Card>
      </div>
    </div>
  );
}
