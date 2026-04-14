import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Parcel } from '@/types/database';

export function useParcels(studentId?: string, status?: string) {
  return useQuery({
    queryKey: ['parcels', studentId, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (studentId) params.append('studentId', studentId);
      if (status) params.append('status', status);
      
      const response = await fetch(`/api/parcels?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch parcels');
      
      const data = await response.json();
      return data.data as Parcel[];
    },
  });
}

export function useParcel(drid: string) {
  return useQuery({
    queryKey: ['parcel', drid],
    queryFn: async () => {
      const response = await fetch(`/api/parcels/${drid}`);
      if (!response.ok) throw new Error('Parcel not found');
      
      const data = await response.json();
      return data.data as Parcel;
    },
    enabled: !!drid,
  });
}

export function useCreateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Parcel>) => {
      const response = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create parcel');
      
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}

export function useUpdateParcel(drid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Parcel>) => {
      const response = await fetch(`/api/parcels/${drid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update parcel');
      
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcel', drid] });
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}
