import { Parcel } from '@/types/database';
import { formatDate } from '@/lib/utils/format';
import { STATUS_COLORS } from '@/lib/constants/statusColors';
import { Package, Calendar, MapPin } from 'lucide-react';

interface ParcelCardProps {
  parcel: Parcel;
  onClick?: () => void;
}

export function ParcelCard({ parcel, onClick }: ParcelCardProps) {
  const statusColor = STATUS_COLORS[parcel.status] || STATUS_COLORS.payment_pending;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-[0px_20px_40px_rgba(4,18,46,0.04)] hover:shadow-[0px_20px_40px_rgba(4,18,46,0.08)] transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#04122e]/5 flex items-center justify-center">
            <Package className="w-6 h-6 text-[#04122e]" />
          </div>
          <div>
            <p className="font-semibold text-[#04122e]">{parcel.drid}</p>
            <p className="text-sm text-[#04122e]/60">{parcel.courier_company}</p>
          </div>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
          }}
        >
          {parcel.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#04122e]/60">
          <Calendar className="w-4 h-4" />
          <span>{parcel.expected_date ? formatDate(parcel.expected_date) : 'TBD'}</span>
          <span className="ml-2">{parcel.preferred_time_slot}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#04122e]/60">
          <MapPin className="w-4 h-4" />
          <span>
            {parcel.hostel_block} - Room {parcel.room_number}
          </span>
        </div>
      </div>
    </div>
  );
}
