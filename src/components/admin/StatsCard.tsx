import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0px_20px_40px_rgba(4,18,46,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#04122e]/5 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#04122e]" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : '-'}
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-[#04122e] mb-1">{value}</h3>
      <p className="text-sm text-[#04122e]/60">{title}</p>
    </div>
  );
}
