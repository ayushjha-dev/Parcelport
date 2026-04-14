'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export default function AdminParcelsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="All Parcels" subtitle="Master parcel registry" showSearch showExportButton />
      
      <div className="pt-28 pb-12 px-10">
        <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10 p-6">
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45464d] w-4 h-4" />
              <Input className="pl-12 bg-[#f0f4f8] border-none rounded-xl" placeholder="Search parcel records" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          <EmptyState title="No parcels available" description="All parcel records will appear here once the data source is connected." />
        </Card>
      </div>
    </div>
  );
}
