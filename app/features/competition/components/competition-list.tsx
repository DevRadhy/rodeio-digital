import { RegistrationCard } from "@/components/shared/registrations/registration-card";
import type { Group, GroupRegistration } from "../types/competition";

interface CompetitionListProps {
  group: Group;
  registrations: GroupRegistration[];
}

export function CompetitionList({
  group,
  registrations,
}: CompetitionListProps) {
  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {registrations.map((registration) => (
        <RegistrationCard
          key={registration.id}
          group={group}
          registration={registration}
        />
      ))}
    </div>
  );
}
