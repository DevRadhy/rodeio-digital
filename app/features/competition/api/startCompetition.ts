import { api } from "@/providers/api";

export const startCompetition = async (categoryId: string) => {
  try {
    const { data } = await api.post("/competition/start", { categoryId });

    return data;
  } catch (error) {
    console.error(error);
  }
};
