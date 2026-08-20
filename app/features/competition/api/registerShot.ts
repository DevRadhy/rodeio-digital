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

export const registerShot = async ({
  competitionId,
  groupId,
  roundId,
  registrationId,
  competitorId,
  shot,
}: RegisterShotProps): Promise<void> => {
  try {
    const { data } = await api.post(`/competition/${competitionId}/shot`, {
      groupId,
      roundId,
      registrationId,
      competitorId,
      shot,
    });

    return data;
  } catch (error) {
    console.error(error);
  }
};
