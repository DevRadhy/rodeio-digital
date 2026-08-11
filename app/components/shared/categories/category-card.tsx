import type { ReactNode } from "react";
import { useCompetition } from "@/hooks/use-competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";
import { formatPhase } from "@/utils";
import { Badge } from "../../ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { CategoryBadges } from "./category-badges";

interface CategoryCardProps {
  category: Category;
  children: ReactNode;
}

export function CategoryCard({ category, children }: CategoryCardProps) {
  const { registrationsByCompetition } = useRegistrationStore();
  const { competition } = useCompetition(category.id);

  const registrations = registrationsByCompetition(category.id);

  const phase = formatPhase(competition?.phase);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardAction>
          <Badge
            variant={"secondary"}
            className={`${phase.bg} ${phase.color} font-semibold`}
          >
            {phase.text}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center flex-1 gap-2">
        <CategoryBadges category={category} registrations={registrations} />
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}
