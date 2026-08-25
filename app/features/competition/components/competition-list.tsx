import { RegistrationCard } from "@/features/competition/components/competition-registration-card";
import {
  useGroupRegistrations,
  useRoundGroupResults,
} from "../hooks/use-competition";
import type { Group } from "../types/competition";

interface CompetitionListProps {
  group: Group;
}

export function CompetitionList({ group }: CompetitionListProps) {
  const registrations = useGroupRegistrations(group.competitionId, group.id);
  const results = useRoundGroupResults(
    group.competitionId,
    group.id,
    group.currentRound.id,
  );

  if (results.isLoading) return;

  if (results.isError) return;

  if (registrations.isLoading) return;

  if (!registrations.data || registrations.isError) return;

  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {registrations.data.map((registration) => (
        <RegistrationCard
          key={registration.id}
          group={group}
          registration={registration}
          results={results.data?.results}
        />
      ))}
    </div>
  );
}
