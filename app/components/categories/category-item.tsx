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
  const { registrationsByCompetition } = useRegistrationStore();

  const registrations = registrationsByCompetition(category.id);

  return (
    <Item variant={"outline"}>
      <ItemMedia variant={"icon"}>
        {category.final.duel ? <Swords /> : <Users />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{category.name}</ItemTitle>
        <ItemDescription className="flex flex-wrap items-center flex-1 gap-2">
          <CategoryBadges category={category} registrations={registrations} />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant={"default"} onClick={onEdit}>
          <Edit />
        </Button>
        <Alert onConfirm={() => deleteCategory(category.id)} />
      </ItemActions>
      <ItemFooter className="inline-block space-x-2">
        {category.final.duel &&
          category.final.groups.map((group) => (
            <Badge variant={"secondary"} key={group.id}>
              <span className="font-bold">
                {group.name}
                {": "}
              </span>
              {group.qualifyingShots.join(", ")} Armadas
            </Badge>
          ))}
      </ItemFooter>
    </Item>
  );
}
