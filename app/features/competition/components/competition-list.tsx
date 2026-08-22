import { RegistrationCard } from "@/features/competition/components/competition-registration-card";
import { useGroupRegistrations } from "../hooks/use-competition";
import type { Group, RoundResults } from "../types/competition";

interface CompetitionListProps {
  group: Group;
  results: RoundResults;
}

export function CompetitionList({ group, results }: CompetitionListProps) {
  const registrations = useGroupRegistrations(group.competitionId, group.id);

  if (registrations.isLoading) return;

  if (!registrations.data || registrations.isError) return;

  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {registrations.data.map((registration) => (
        <RegistrationCard
          key={registration.id}
          group={group}
          registration={registration}
          results={results.results}
        />
      ))}
    </div>
  );
}
