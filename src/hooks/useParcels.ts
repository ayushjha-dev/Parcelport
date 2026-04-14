import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase/client';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { Parcel } from '@/types/database';

export function useParcels(studentId?: string, status?: string) {
  return useQuery({
    queryKey: ['parcels', studentId, status],
    queryFn: async () => {
      const parcelsRef = collection(db, 'parcels');
      let q = query(parcelsRef, orderBy('created_at', 'desc'));
      
      if (studentId) {
        q = query(q, where('student_id', '==', studentId));
      }
      if (status) {
        q = query(q, where('status', '==', status));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Parcel));
    },
  });
}

export function useParcel(drid: string) {
  return useQuery({
    queryKey: ['parcel', drid],
    queryFn: async () => {
      const parcelsRef = collection(db, 'parcels');
      const q = query(parcelsRef, where('drid', '==', drid));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Parcel not found');
      }
      
      const docData = snapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Parcel;
    },
    enabled: !!drid,
  });
}

export function useCreateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Parcel>) => {
      const parcelsRef = collection(db, 'parcels');
      const docRef = await addDoc(parcelsRef, {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
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
      // Find document by DRID
      const parcelsRef = collection(db, 'parcels');
      const q = query(parcelsRef, where('drid', '==', drid));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Parcel not found');
      }
      
      const docRef = doc(db, 'parcels', snapshot.docs[0].id);
      await updateDoc(docRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
      
      return { id: snapshot.docs[0].id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcel', drid] });
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}
