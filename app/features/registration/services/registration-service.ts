import { api } from "@/providers/api";
import type { CreateRegistrationInput } from "@/schemas/registration-schema";
import type { Registration } from "@/types/registration";

export const createRegistration = async (
  registrations: CreateRegistrationInput,
): Promise<Registration | null> => {
  try {
    const { data } = await api.post("/registrations", registrations);

    return data;
  } catch (_error) {
    return null;
  }
};

export const findRegistrations = async (
  categoryId: string,
): Promise<Registration | null> => {
  try {
    const { data } = await api.get(`/registrations/category/${categoryId}`);

    return data;
  } catch (_error) {
    return null;
  }
};
