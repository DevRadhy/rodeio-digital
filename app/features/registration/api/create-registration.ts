import { api } from "@/providers/api";
import type { CreateRegistrationInput } from "../schemas/registration-schema";
import type { Registration } from "../types/registration";

export const createRegistration = async (
  registrations: CreateRegistrationInput,
): Promise<Registration & { competitionId?: string; groupId?: string }> => {
  const { data } = await api.post("/registrations", registrations);
  return data;
};
