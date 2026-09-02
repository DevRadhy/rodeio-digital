import { api } from "@/providers/api";
import type { Shot } from "../types/competition";
interface RegisterShotProps {
  competitionId: string;
  groupId: string;
  roundId: string;
  registrationId: string;
  competitorId: string;
  shot: Shot;
}
export async function registerShot(input: RegisterShotProps): Promise<void> {
  await api.post(`/competition/${input.competitionId}/shot`, input);
}
