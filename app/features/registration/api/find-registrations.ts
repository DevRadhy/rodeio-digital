import { api } from "@/providers/api";
import type { Registration } from "../types/registration";

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
