'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';

export default function TrackDeliveryPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Track Delivery" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-3xl p-8 shadow-[0px_20px_40px_rgba(4,18,46,0.04)]">
            <EmptyState
              title="No parcel selected"
              description="Tracking details will appear here after a parcel is registered and assigned."
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
