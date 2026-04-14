import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      
      updateStep1: (newData) => 
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        })),
      
      updateStep2: (newData) => 
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        })),
      
      updateStep3: (newData) => 
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        })),
      
      updateStep4: (newData) => 
        set((state) => ({ 
          data: { ...state.data, ...newData } 
        })),
      
      reset: () => set({ data: initialData }),
      
      getData: () => get().data,
    }),
    {
      name: 'parcel-registration-storage',
    }
  )
);
