import { api } from "@/providers/api";

interface FinishQualificaitonProps {
  competitionId: string;
}

export const finishQualificaiton = async ({
  competitionId,
}: FinishQualificaitonProps) => {
  try {
    const { data } = await api.post(
      `/competition/${competitionId}/qualification/finish`,
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};
