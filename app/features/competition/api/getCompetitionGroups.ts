import { api } from "@/providers/api";
import type { Group } from "../types/competition";

export const getCompetitionGroups = async (
  competitionId: string,
): Promise<Group[]> => {
  const { data } = await api.get(`/competition/${competitionId}/groups`);

  return data;
};
