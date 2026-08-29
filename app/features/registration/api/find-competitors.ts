import { api } from "@/providers/api";
import type { Competitor } from "@/types/competitor";

export const findCompetitors = async (name: string): Promise<Competitor[]> => {
  const { data } = await api.get(`/competitors?name=${name}`);

  return data;
};
