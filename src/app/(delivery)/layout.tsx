import { DeliverySidebar } from '@/components/layout/DeliverySidebar';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['delivery_boy']}>
      <div className="min-h-screen bg-[#f6fafe]">
        <DeliverySidebar />
        <main className="ml-[240px] min-h-screen">{children}</main>
      </div>
    </RoleGuard>
  );
}
