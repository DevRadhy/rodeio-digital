import { RegistrationCard } from "@/features/competition/components/competition-registration-card";
import type { Group, GroupRegistration, Result } from "../types/competition";
interface Props {
  group: Group;
  registrations: GroupRegistration[];
  results: Result[];
  allowCorrection?: boolean;
}
export function CompetitionList({
  group,
  registrations,
  results,
  allowCorrection,
}: Props) {
  const judgingRegistration =
    group.status !== "finished" && group.currentRound.status !== "finished"
      ? registrations.find((registration) =>
          registration.competitors.some(
            (competitor) =>
              !results.some(
                (result) =>
                  result.registrationId === registration.id &&
                  result.competitorId === competitor.id,
              ),
          ),
        )
      : undefined;

  return (
    <div className="flex flex-col justify-center gap-4 py-8">
      {registrations.map((registration) => (
        <RegistrationCard
          key={registration.id}
          group={group}
          allowCorrection={allowCorrection}
          registration={registration}
          isJudging={registration.id === judgingRegistration?.id}
          results={results.filter(
            (result) => result.registrationId === registration.id,
          )}
        />
      ))}
    </div>
  );
}
