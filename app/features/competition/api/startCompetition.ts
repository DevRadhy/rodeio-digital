import { api } from "@/providers/api";

interface StartCompetitionResponse {
  competitionId: string;
}

export const startCompetition = async (
  categoryId: string,
): Promise<StartCompetitionResponse> => {
  const { data } = await api.post("/competition/start", { categoryId });
  return data;
};
