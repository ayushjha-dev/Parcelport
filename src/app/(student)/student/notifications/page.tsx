'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Notifications" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#04122e]">All Notifications</h2>
            <Button variant="outline" size="sm">Mark all as read</Button>
          </div>

          <EmptyState
            title="No notifications yet"
            description="Delivery, payment, and system updates will appear here when your account has activity."
          />
        </div>
      </div>
    </div>
  );
}
