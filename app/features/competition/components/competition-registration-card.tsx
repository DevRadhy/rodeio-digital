import { Badge } from "@/components/ui/badge";
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
  isJudging?: boolean;
  allowCorrection?: boolean;
  currentCompetitorId?: string;
  saving: boolean;
  onRegisterShot(
    registrationId: string,
    competitorId: string,
    shot: Shot,
  ): void;
}

export function RegistrationCard({
  registration,
  group,
  results,
  isJudging = false,
  allowCorrection,
  currentCompetitorId,
  saving,
  onRegisterShot,
}: RegistrationCardProps) {
  const registrationsName = registration.competitors
    .map((competitor) => competitor.name)
    .join(" / ");

  return (
    <Card
      size="sm"
      aria-current={isJudging ? "true" : undefined}
      className={isJudging ? "ring-2 ring-success" : undefined}
    >
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <CardTitle className="font-sans text-base font-semibold normal-case text-foreground">
          {registrationsName}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {isJudging && (
            <Badge
              variant="outline"
              className="border-success bg-success/10 text-primary"
            >
              Em julgamento
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="font-mono tabular-nums"
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
        <span className="pr-2 font-mono text-2xl font-bold text-muted-foreground">
          {registration.number}
        </span>
        <ItemGroup className="min-w-0 flex-1 gap-3">
          {registration.competitors.map((competitor) => (
            <CompetitionCompetitor
              key={competitor.id}
              group={group}
              allowCorrection={allowCorrection}
              saving={saving}
              isJudging={competitor.id === currentCompetitorId}
              competitor={competitor}
              result={results?.find(
                (result) => result.competitorId === competitor.id,
              )}
              handleRegisterShot={(competitorId, shot) =>
                onRegisterShot(registration.id, competitorId, shot)
              }
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
