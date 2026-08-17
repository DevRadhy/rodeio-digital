import { api } from "@/providers/api";

interface StartCompetitionResponse {
  competitionId: string;
}

export const startCompetition = async (
  categoryId: string,
): Promise<StartCompetitionResponse | undefined> => {
  try {
    const { data } = await api.post("/competition/start", { categoryId });

    return data;
  } catch (error) {
    console.error(error);
  }
};
