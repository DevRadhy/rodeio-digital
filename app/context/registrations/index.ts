import type { Registration } from "@/types/registration";
import { create } from "zustand";

interface RegistrationsState {
  registrations: Registration[];
  addRegistration: (newRegistration: Registration) => void;
}

export const useRegistrations = create<RegistrationsState>()((set) => ({
  registrations: [],
  addRegistration: (newRegistration) =>
    set((state) => ({
      registrations: [...state.registrations, newRegistration],
    })),
}));
