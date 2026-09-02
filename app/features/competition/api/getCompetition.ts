import { api } from "@/providers/api";
import type { Competition } from "../types/competition";
export async function getCompetition(
  competitionId: string,
): Promise<Competition> {
  const { data } = await api.get<Competition>(`/competition/${competitionId}`);
  return data;
}
