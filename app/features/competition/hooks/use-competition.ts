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
  });
}

export function useGroupRegistrations(competitionId: string, groupId: string) {
  return useQuery({
    queryKey: ["group-registrations", competitionId, groupId],
    queryFn: () => getGroupRegistrations(competitionId, groupId),
  });
}

export function useRoundGroupResults(competitionId: string, roundId: string) {
  return useQuery({
    queryKey: ["round-group-results", competitionId, roundId],
    queryFn: () => getRoundGroupResults(competitionId, roundId),
  });
}
