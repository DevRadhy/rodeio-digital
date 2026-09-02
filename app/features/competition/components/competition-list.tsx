import { RegistrationCard } from "@/features/competition/components/competition-registration-card";
import type { Group, GroupRegistration, Result } from "../types/competition";
interface Props {
  group: Group;
  registrations: GroupRegistration[];
  results: Result[];
}
export function CompetitionList({ group, registrations, results }: Props) {
  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {registrations.map((registration) => (
        <RegistrationCard
          key={registration.id}
          group={group}
          registration={registration}
          results={results.filter(
            (result) => result.registrationId === registration.id,
          )}
        />
      ))}
    </div>
  );
}
