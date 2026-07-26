import type { Category } from "@/types/category";
import { Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface CategoryCardProps {
  category: Category;
  onRegister: () => void;
}

export function CategoryCard({ category, onRegister }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge variant={"secondary"}>
          {category.competitors}{" "}
          {category.competitors <= 1 ? "competidor" : "competidores"}
        </Badge>
        <Badge variant={category.rounds <= 1 ? "destructive" : "secondary"}>
          {category.rounds <= 1 ? "eliminatória" : `${category.rounds} voltas`}
        </Badge>
        {category.value ? (
          <Badge variant={"secondary"}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(category.value)}
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
