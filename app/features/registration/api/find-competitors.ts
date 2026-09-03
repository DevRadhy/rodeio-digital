import { api } from "@/providers/api";
import type { Competitor } from "@/types/competitor";

export const findCompetitors = async (
  name: string,
  signal?: AbortSignal,
): Promise<Competitor[]> => {
  const { data } = await api.get("/competitors", { params: { name }, signal });

  return data;
};
