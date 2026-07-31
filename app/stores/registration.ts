import type { Registration } from "@/types/registration";
import { create } from "zustand";

interface RegistrationsState {
  registrations: Registration[];
  addRegistration: (newRegistration: Registration) => void;
  registrationByCompetition: (categoryId: string) => Registration[];
}

export const useRegistrationStore = create<RegistrationsState>()((set, get) => ({
  registrations: [],
  addRegistration: (newRegistration) =>
    set((state) => ({
      registrations: [...state.registrations, newRegistration],
    })),
  registrationByCompetition: (categoryId) =>
    get().registrations.filter(
      (registration) => registration.categoryId === categoryId,
    ),
}));
