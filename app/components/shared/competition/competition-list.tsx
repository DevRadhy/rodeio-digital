import type { Competition, CompetitionGroup } from "@/types/competition";
import { RegistrationCard } from "../registrations/registration-card";

interface CompetitionListProps {
  group: CompetitionGroup;
}

export function CompetitionList({ group }: CompetitionListProps) {
  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {group.rounds[group.currentRound - 1].results.map((result) => (
        <RegistrationCard
          key={result.registrationId}
          registration={group.registrations.find(
            (r) => r.id === result.registrationId,
          )!}
          group={group}
        />
      ))}
    </div>
  );
}
