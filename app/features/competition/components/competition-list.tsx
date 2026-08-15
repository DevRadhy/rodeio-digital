import { RegistrationCard } from "@/components/shared/registrations/registration-card";
import type { QualificationGroupState } from "../types/competition";

interface CompetitionListProps {
  group: QualificationGroupState;
}

export function CompetitionList({ group }: CompetitionListProps) {
  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {group.registrations.map((registration) => (
        <RegistrationCard key={registration.id} registration={registration} />
      ))}
    </div>
  );
}
