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
