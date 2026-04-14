import { useParcelFormStore } from '@/store/parcelFormStore';

export function useParcelForm() {
  const store = useParcelFormStore();

  const goToNextStep = () => {
    if (store.currentStep < 5) {
      store.setCurrentStep(store.currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (store.currentStep > 1) {
      store.setCurrentStep(store.currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<typeof store.formData>) => {
    store.setFormData({ ...store.formData, ...data });
  };

  const resetForm = () => {
    store.resetForm();
  };

  return {
    currentStep: store.currentStep,
    formData: store.formData,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    resetForm,
    setCurrentStep: store.setCurrentStep,
  };
}
