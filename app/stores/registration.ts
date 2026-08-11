import { create } from "zustand";
import type { Registration } from "@/types/registration";

interface RegistrationsState {
  registrations: Registration[];
  addRegistration: (newRegistration: Registration) => void;
  registrationsByCompetition: (categoryId: string) => Registration[];
}

export const useRegistrationStore = create<RegistrationsState>()(
  (set, get) => ({
    registrations: [],
    addRegistration: (newRegistration) =>
      set((state) => ({
        registrations: [...state.registrations, newRegistration],
      })),
    registrationsByCompetition: (categoryId) =>
      get().registrations.filter(
        (registration) => registration.categoryId === categoryId,
      ),
  }),
);
