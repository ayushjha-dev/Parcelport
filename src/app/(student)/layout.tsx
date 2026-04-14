import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-[#f6fafe]">
        <StudentSidebar />
        <main className="ml-[240px] min-h-screen">{children}</main>
      </div>
    </RoleGuard>
  );
}
