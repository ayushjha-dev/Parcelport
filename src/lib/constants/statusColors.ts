import type { ParcelStatus } from '@/types/database';

export const STATUS_COLORS: Record<ParcelStatus, { bg: string; text: string; label: string }> = {
  submitted: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Submitted',
  },
  payment_pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Payment Pending',
  },
  payment_verified: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Payment Verified',
  },
  assigned: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'Assigned',
  },
  out_for_delivery: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    label: 'Out for Delivery',
  },
  delivered: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    label: 'Delivered',
  },
  failed_delivery: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Failed Delivery',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Cancelled',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Rejected',
  },
};
