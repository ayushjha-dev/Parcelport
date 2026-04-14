import { STATUS_COLORS } from '@/lib/constants/statusColors';
import { ParcelStatus } from '@/types/database';

interface StatusBadgeProps {
  status: ParcelStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.payment_pending;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
