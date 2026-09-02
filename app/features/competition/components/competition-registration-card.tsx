import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerShot } from "@/features/competition/api/registerShot";
import { groupKeys } from "@/features/competition/api/group-queries";
import { CompetitionCompetitor } from "@/features/competition/components/competition-competitor";
import type {
  Group,
  GroupRegistration,
  Result,
  Shot,
} from "@/features/competition/types/competition";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ItemGroup } from "../../../components/ui/item";

interface RegistrationCardProps {
  registration: GroupRegistration;
  group: Group;
  results?: Result[];
}

export function RegistrationCard({
  registration,
  group,
  results,
}: RegistrationCardProps) {
  const queryClient = useQueryClient();

  const setShot = useMutation({
    mutationFn: registerShot,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.rounds(variables.competitionId, variables.groupId),
      });
    },
  });

  const handleSetShot = (competitorId: string, shot: Shot) => {
    setShot.mutate({
      competitionId: group.competitionId,
      groupId: group.id,
      roundId: group.currentRound.id,
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
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <CardTitle className="text-muted-foreground">
          {registrationsName}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="tabular-nums"
            title="Positivas / armadas jogadas nesta fase, até a volta exibida"
            aria-label={`Parcial da inscrição: ${registration.positiveShots} positivas em ${registration.totalShots} armadas jogadas`}
          >
            Parcial {registration.positiveShots}/{registration.totalShots}
          </Badge>
          {registration.bonus !== undefined && (
            <Badge variant="outline">Bônus atual: {registration.bonus}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex items-center">
        <span className="pr-2 text-2xl font-bold text-muted-foreground">
          {registration.number}
        </span>
        <ItemGroup className="min-w-0 flex-1 gap-3">
          {registration.competitors.map((competitor) => (
            <CompetitionCompetitor
              key={competitor.id}
              group={group}
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
