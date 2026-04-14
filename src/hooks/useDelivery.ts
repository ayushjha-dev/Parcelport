import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Parcel } from '@/types/database';

export function useTodayDeliveries() {
  return useQuery({
    queryKey: ['deliveries', 'today'],
    queryFn: async () => {
      const res = await fetch('/api/delivery/today');
      if (!res.ok) throw new Error('Failed to fetch deliveries');
      return res.json() as Promise<Parcel[]>;
    },
  });
}

export function usePickupParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (drid: string) => {
      const res = await fetch(`/api/delivery/${drid}/pickup`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to pickup parcel');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });
}

export function useDeliverParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ drid, otp }: { drid: string; otp: string }) => {
      const res = await fetch(`/api/delivery/${drid}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      if (!res.ok) throw new Error('Invalid OTP');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });
}

export function useReportIssue() {
  return useMutation({
    mutationFn: async (data: {
      drid: string;
      issue_type: string;
      description: string;
      photo_url?: string;
    }) => {
      const res = await fetch('/api/delivery/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to report issue');
      return res.json();
    },
  });
}
