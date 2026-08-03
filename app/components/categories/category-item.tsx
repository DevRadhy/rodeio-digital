import { useCategoryStore } from "@/stores/category";
import { useRegistrationStore } from "@/stores/registration";
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
import { CategoryBadges } from "./category-badges";

interface CategoryItemProps {
  category: Category;
  onEdit: () => void;
}

export function CategoryItem({ category, onEdit }: CategoryItemProps) {
  const { deleteCategory } = useCategoryStore();
  const registrationsByCompetition = useRegistrationStore(
    (state) => state.registrationByCompetition,
  );

  const registrations = registrationsByCompetition(category.id);

  return (
    <Item variant={"outline"}>
      <ItemMedia variant={"icon"}>
        {category.forces.length ? <Swords /> : <Users />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{category.name}</ItemTitle>
        <ItemDescription className="flex flex-wrap gap-2">
          <CategoryBadges category={category} registrations={registrations} />
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
