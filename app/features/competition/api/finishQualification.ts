import { api } from "@/providers/api";

interface FinishQualificaitonProps {
  competitionId: string;
}

export const finishQualificaiton = async ({
  competitionId,
}: FinishQualificaitonProps) => {
  const { data } = await api.post(
    `/competition/${competitionId}/qualification/finish`,
  );
  return data;
};
