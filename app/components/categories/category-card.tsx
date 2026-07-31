import type { Category } from "@/types/category";
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
import { useRegistrationStore } from "@/stores/registration";
import { useCompetitionSessionStore } from "@/stores/competition";
import { CategoryBadges } from "./category-badges";

interface CategoryCardProps {
  category: Category;
  onRegister: () => void;
}

export function CategoryCard({ category, onRegister }: CategoryCardProps) {
  const registrationsByCompetition = useRegistrationStore(
    (state) => state.registrationByCompetition,
  );
  const getSession = useCompetitionSessionStore((state) => state.getSession);

  const session = getSession(category.id)
  const registrations = registrationsByCompetition(category.id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription>teste</CardDescription>
        <CardAction>
          <Badge variant={"secondary"}>
            {session?.status ?? "Não Iniciada"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-2">
        <CategoryBadges category={category} registrations={registrations} />
      </CardContent>
      <CardFooter>
        <Button variant={"ghost"} onClick={onRegister} className={"w-full"}>
          <Plus /> Adicionar Inscrição
        </Button>
      </CardFooter>
    </Card>
  );
}
