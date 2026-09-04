import { useQuery } from "@tanstack/react-query";
import { getCompetition } from "../api/getCompetition";
import { getCompetitionGroups } from "../api/getCompetitionGroups";
import { getGroupRegistrations } from "../api/getGroupRegistrations";
import { getRoundGroupResults } from "../api/getRoundGroupResults";

export function useCompetition(competitionId: string) {
  return useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => getCompetition(competitionId),
  });
}

export function useGroups(competitionId: string) {
  return useQuery({
    queryKey: ["groups", competitionId],
    queryFn: () => getCompetitionGroups(competitionId),
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
}

export function useGroupRegistrations(
  competitionId: string,
  groupId: string | null,
) {
  return useQuery({
    queryKey: ["group-registrations", competitionId, groupId],
    queryFn: () => getGroupRegistrations(competitionId, String(groupId)),
    enabled: Boolean(competitionId && groupId),
  });
}

export function useRoundGroupResults(
  competitionId: string,
  groupId: string | null,
  roundId: string | null,
) {
  return useQuery({
    queryKey: ["round-group-results", competitionId, groupId, roundId],
    queryFn: () =>
      getRoundGroupResults(competitionId, String(groupId), String(roundId)),
    enabled: Boolean(groupId && roundId),
  });
}
