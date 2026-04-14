import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ParcelFormData } from '@/types/parcel';

interface ParcelFormStore {
  formData: Partial<ParcelFormData>;
  currentStep: number;
  setFormData: (data: Partial<ParcelFormData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
}

export const useParcelFormStore = create<ParcelFormStore>()(
  persist(
    (set) => ({
      formData: {},
      currentStep: 1,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetForm: () => set({ formData: {}, currentStep: 1 }),
    }),
    {
      name: 'parcel-form-storage',
    }
  )
);
