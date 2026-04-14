import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ParcelRegistrationData {
  // Step 1: Personal Information
  fullName: string;
  email: string;
  mobile: string;
  hostelBlock: string;
  floorNumber: string;
  roomNumber: string;
  landmark: string;
  
  // Step 2: Parcel Information
  trackingId: string;
  courierCompany: string;
  description: string;
  weightRange: string;
  expectedDate: string;
  isFragile: boolean;
  
  // Step 3: Time Slot
  timeSlot: string;
  
  // Step 4: Payment
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  screenshot: File | null;
  screenshotUrl: string;
}

interface ParcelRegistrationStore {
  data: ParcelRegistrationData;
  updateStep1: (data: Partial<ParcelRegistrationData>) => void;
  updateStep2: (data: Partial<ParcelRegistrationData>) => void;
  updateStep3: (data: Partial<ParcelRegistrationData>) => void;
  updateStep4: (data: Partial<ParcelRegistrationData>) => void;
  reset: () => void;
  getData: () => ParcelRegistrationData;
}

const initialData: ParcelRegistrationData = {
  fullName: '',
  email: '',
  mobile: '',
  hostelBlock: '',
  floorNumber: '',
  roomNumber: '',
  landmark: '',
  trackingId: '',
  courierCompany: '',
  description: '',
  weightRange: '',
  expectedDate: '',
  isFragile: false,
  timeSlot: '',
  paymentMethod: '',
  transactionId: '',
  paymentDate: '',
  screenshot: null,
  screenshotUrl: '',
};

export const useParcelRegistrationStore = create<ParcelRegistrationStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      
      updateStep1: (newData) => {
        console.log('Store: Updating Step 1 with:', newData);
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        }));
        console.log('Store: Step 1 updated, current data:', get().data);
      },
      
      updateStep2: (newData) => {
        console.log('Store: Updating Step 2 with:', newData);
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        }));
        console.log('Store: Step 2 updated, current data:', get().data);
      },
      
      updateStep3: (newData) => {
        console.log('Store: Updating Step 3 with:', newData);
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        }));
        console.log('Store: Step 3 updated, current data:', get().data);
      },
      
      updateStep4: (newData) => {
        console.log('Store: Updating Step 4 with:', newData);
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        }));
        console.log('Store: Step 4 updated, current data:', get().data);
      },
      
      reset: () => {
        console.log('Store: Resetting to initial data');
        set({ data: initialData });
      },
      
      getData: () => get().data,
    }),
    {
      name: 'parcel-registration-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: {
          ...state.data,
          screenshot: null, // Don't persist File objects
        },
      }),
    }
  )
);
