import type { Registration } from "@/types/registration";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ItemGroup } from "../ui/item";
import type { CompetitionGroup } from "@/types/competition";
import { CompetitionCompetitor } from "../competition/competition-competitor";

interface RegistrationCardProps {
  registration: Registration;
  group: CompetitionGroup;
}

export function RegistrationCard({ registration, group }: RegistrationCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          {registration.competitors
            .map((competitor) => competitor.name)
            .join(" / ")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center">
        <span className="pr-2 text-2xl font-bold text-muted-foreground">
          {registration.number}
        </span>
        <ItemGroup>
          {registration.competitors.map((competitor) => (
            <CompetitionCompetitor
              key={competitor.id}
              competitor={competitor}
              registration={registration}
              group={group}
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
