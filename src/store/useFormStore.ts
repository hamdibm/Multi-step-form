// store/useFormStore.ts
import { create } from "zustand";

type FormData = {
  name: string;
  email: string;
  address: string;
  password: string;
};

type FormStore = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
};

export const useFormStore = create<FormStore>((set) => ({
  formData: { name: "", email: "", address: "", password: "" },
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
}));
