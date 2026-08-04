import type { Competition, CompetitionGroup } from "@/types/competition";
import { RegistrationCard } from "../registrations/registration-card";

interface CompetitionListProps {
  group: CompetitionGroup;
}

export function CompetitionList({ group }: CompetitionListProps) {
  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {group.registrations.map((registration) => (
        <RegistrationCard
          key={registration.id}
          registration={registration}
          group={group}
        />
      ))}
    </div>
  );
}
