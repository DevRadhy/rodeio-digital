import type { Category } from "@/types/category";
import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRegistrations } from "@/context/registrations";

interface CategoryCardProps {
  category: Category;
  onRegister: () => void;
}

export function CategoryCard({ category, onRegister }: CategoryCardProps) {
  const { registrations } = useRegistrations();

  const registrationsCount = () => {
    const categoryRegistrations = registrations.filter(
      (registration) => registration.categoryId === category.id,
    );

    return categoryRegistrations.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardAction>
          <Badge>
            {registrationsCount()} Inscrições
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge variant={"secondary"}>
          {category.competitors}{" "}
          {category.competitors <= 1 ? "competidor" : "competidores"}
        </Badge>
        <Badge variant={category.rounds <= 1 ? "destructive" : "secondary"}>
          {category.rounds <= 1 ? "eliminatória" : `${category.rounds} voltas`}
        </Badge>
        {category.price ? (
          <Badge variant={"secondary"}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(category.price)}
          </Badge>
        ) : (
          <Badge>Gratuito</Badge>
        )}

        {category.isDuel && <Badge variant={"default"}>Duelo</Badge>}
      </CardContent>
      <CardFooter>
        <Button variant={"ghost"} onClick={onRegister} className={"w-full"}>
          <Plus /> Adicionar Inscrição
        </Button>
      </CardFooter>
    </Card>
  );
}
