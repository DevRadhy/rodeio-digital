import { useCompetition } from "@/hooks/use-competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";
import type { Status } from "@/types/competition";
import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CategoryBadges } from "./category-badges";
import type { ReactNode } from "react";

interface CategoryCardProps {
  category: Category;
  children: ReactNode;
}

export function CategoryCard({ category, children }: CategoryCardProps) {
  const { registrationsByCompetition } = useRegistrationStore();
  const { competition } = useCompetition(category.id);

  const registrations = registrationsByCompetition(category.id);

  const formatStatus = (status: Status) => {
    switch (status) {
      case "running":
        return {
          text: "Em Andamento",
          color: "bg-emerald-400",
        };
      case "paused":
        return {
          text: "Em Pausa",
          color: "bg-amber-400",
        };
      case "finished":
        return {
          text: "Encerrada",
          color: "bg-rose-400",
        };
      default:
        return {
          text: "Não Iniciada",
          color: "text-primary",
        };
    }
  };

  const status = formatStatus(competition?.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardAction>
          <Badge variant={"secondary"} className={`${status.color}`}>
            {status.text}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-2">
        <CategoryBadges category={category} registrations={registrations} />
      </CardContent>
      <CardFooter>
        {children}
      </CardFooter>
    </Card>
  );
}
