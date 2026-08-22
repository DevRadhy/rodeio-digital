import { api } from "@/providers/api";
import type { GroupRegistration } from "../types/competition";

export const getGroupRegistrations = async (
  competitionId: string,
  groupId: string,
): Promise<GroupRegistration[]> => {
  if (!competitionId || !groupId) return [];

  const { data } = await api.get(
    `/competition/${competitionId}/groups/${groupId}/registrations`,
  );

  return data;
};
