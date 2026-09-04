import { queryOptions } from "@tanstack/react-query";
import { api } from "@/providers/api";
import type {
  GroupRegistration,
  Phase,
  Result,
  Status,
} from "../types/competition";

export interface GroupDetails {
  id: string;
  competitionId: string;
  name: string;
  phase: Phase;
  status: Status;
  roundNumber: number;
}
export interface GroupRound {
  id: string;
  groupId: string;
  number: number;
  status: Status;
  startedAt: string | null;
  registrations: GroupRegistration[];
  results: Result[];
}

export const groupKeys = {
  group: (competitionId: string, groupId: string) =>
    ["competition-group", competitionId, groupId] as const,
  rounds: (competitionId: string, groupId: string) =>
    ["competition-round", competitionId, groupId] as const,
  round: (competitionId: string, groupId: string, number: number) =>
    ["competition-round", competitionId, groupId, number] as const,
};

export function groupOptions(competitionId: string, groupId: string) {
  return queryOptions({
    queryKey: groupKeys.group(competitionId, groupId),
    queryFn: async ({ signal }) => {
      const { data } = await api.get<GroupDetails>(
        `/competition/${competitionId}/groups/${groupId}`,
        { signal },
      );
      return data;
    },
    enabled: Boolean(competitionId && groupId),
    staleTime: 5_000,
    // Structural SSE events are not emitted by all existing mutations yet.
    refetchInterval: 60_000,
  });
}

export function roundOptions(
  competitionId: string,
  groupId: string,
  number: number | null,
) {
  return queryOptions({
    queryKey: groupKeys.round(competitionId, groupId, number ?? 0),
    queryFn: async ({ signal }) => {
      if (number === null) throw new Error("Selecione uma rodada.");
      const { data } = await api.get<GroupRound>(
        `/competition/${competitionId}/groups/${groupId}/rounds/${number}`,
        { signal },
      );
      return data;
    },
    enabled: Boolean(competitionId && groupId && number !== null),
    refetchInterval: (query) =>
      query.state.data?.status === "finished" ? false : 60_000,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
