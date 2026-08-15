import { CompetitionCompetitor } from "@/features/competition/components/competition-competitor";
import type { QualificationRegistrationState } from "@/features/competition/types/competition";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ItemGroup } from "../../ui/item";

interface RegistrationCardProps {
  registration: QualificationRegistrationState;
}

export function RegistrationCard({ registration }: RegistrationCardProps) {
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
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
