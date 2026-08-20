import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import { registerShot } from "@/features/competition/api/registerShot";
import { CompetitionCompetitor } from "@/features/competition/components/competition-competitor";
import type {
  CompetitionRoundRegistrationState,
  QualificationGroupState,
  QualificationResultState,
  Shot,
} from "@/features/competition/types/competition";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ItemGroup } from "../../ui/item";

interface RegistrationCardProps {
  registration: CompetitionRoundRegistrationState;
  results?: QualificationResultState[];
  group: QualificationGroupState;
}

export function RegistrationCard({
  registration,
  results,
  group,
}: RegistrationCardProps) {
  const { competitionId } = useParams();

  const setShot = useMutation({
    mutationFn: registerShot,
  });

  const handleSetShot = (competitorId: string, shot: Shot) => {
    setShot.mutate({
      competitionId: String(competitionId),
      groupId: group.id,
      roundId: String(group.currentRound?.id),
      registrationId: registration.id,
      competitorId,
      shot,
    });
  };

  const registrationsName = registration.competitors
    .map((competitor) => competitor.name)
    .join(" / ");

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          {registrationsName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center">
        <span className="pr-2 text-2xl font-bold text-muted-foreground">
          {registration.number}
        </span>
        <ItemGroup className="gap-0">
          {registration.competitors.map((competitor) => (
            <CompetitionCompetitor
              key={competitor.id}
              competitor={competitor}
              result={results?.find(
                (result) => result.competitorId === competitor.id,
              )}
              handleRegisterShot={handleSetShot}
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
