import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f6fafe]">
        <AdminSidebar />
        <main className="ml-[260px] min-h-screen">{children}</main>
      </div>
    </RoleGuard>
  );
}
