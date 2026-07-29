import { useCategories } from "@/stores/categories";
import type { Category } from "@/types/category";
import { Edit, Swords, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Alert } from "./alert-dialog";

interface CategoryItemProps {
  category: Category;
  onEdit: () => void;
}

export function CategoryItem({ category, onEdit }: CategoryItemProps) {
  const { deleteCategory } = useCategories();

  const onCurrencyFormat = (value: number) => {
    if (!value) return "Gratuito";

    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Item variant={"outline"}>
      <ItemMedia variant={"icon"}>
        {category.forces.length ? <Swords /> : <Users />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{category.name}</ItemTitle>
        <ItemDescription className="flex flex-wrap gap-2">
          <Badge variant={"secondary"}>
            {category.competitors}{" "}
            {category.competitors <= 1 ? "competidor" : "competidores"}
          </Badge>
          <Badge variant={category.rounds <= 1 ? "destructive" : "secondary"}>
            {category.rounds <= 1
              ? "eliminatória"
              : `${category.rounds} voltas`}
          </Badge>
          <Badge variant={"secondary"}>
            {onCurrencyFormat(category.price)}
          </Badge>

          {category.isDuel && <Badge variant={"default"}>Duelo</Badge>}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant={"default"} onClick={onEdit}>
          <Edit />
        </Button>
        <Alert onConfirm={() => deleteCategory(category.id)} />
      </ItemActions>
      <ItemFooter>
        <div className="flex gap-4">
          {category.isDuel &&
            category.forces.map((force) => (
              <Badge variant={"secondary"}>
                <strong>
                  {force.name}
                  {": "}
                </strong>
                {force.qualifyingScores.join(", ")} Armadas
              </Badge>
            ))}
        </div>
      </ItemFooter>
    </Item>
  );
}
