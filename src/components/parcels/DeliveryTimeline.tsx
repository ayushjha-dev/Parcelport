import { ParcelStatus } from '@/types/database';
import { Check, Clock, Package, Truck, Home } from 'lucide-react';

interface TimelineStep {
  status: ParcelStatus;
  label: string;
  icon: React.ElementType;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: 'payment_pending', label: 'Payment Pending', icon: Clock },
  { status: 'payment_verified', label: 'Payment Verified', icon: Check },
  { status: 'assigned', label: 'Assigned to Delivery', icon: Package },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

interface DeliveryTimelineProps {
  currentStatus: ParcelStatus;
}

export function DeliveryTimeline({ currentStatus }: DeliveryTimelineProps) {
  const currentIndex = TIMELINE_STEPS.findIndex((step) => step.status === currentStatus);

  return (
    <div className="relative">
      {TIMELINE_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex items-start gap-4 mb-8 last:mb-0">
            {/* Icon */}
            <div
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isCompleted
                  ? 'bg-[#04122e] text-white'
                  : 'bg-[#04122e]/10 text-[#04122e]/40'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-2">
              <h4
                className={`font-semibold mb-1 ${
                  isCompleted ? 'text-[#04122e]' : 'text-[#04122e]/40'
                }`}
              >
                {step.label}
              </h4>
              {isCurrent && (
                <p className="text-sm text-[#855300] font-medium">Current Status</p>
              )}
            </div>

            {/* Connector Line */}
            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={`absolute left-6 w-0.5 h-8 transition-colors ${
                  index < currentIndex ? 'bg-[#04122e]' : 'bg-[#04122e]/10'
                }`}
                style={{ top: `${(index + 1) * 80}px` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
