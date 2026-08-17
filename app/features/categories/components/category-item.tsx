import { Swords, Users } from "lucide-react";
import { CategoryBadges } from "@/components/shared/categories/category-badges";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Alert } from "@/features/categories/components/alert-dialog";
import type { Category } from "@/features/categories/types/category";

interface CategoryItemProps {
  category: Category;
  onDelete: () => void;
}

export function CategoryItem({ category, onDelete }: CategoryItemProps) {
  return (
    <Item variant={"outline"}>
      <ItemMedia variant={"icon"}>
        {category.duel ? <Swords /> : <Users />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{category.name}</ItemTitle>
        <ItemDescription className="flex flex-wrap items-center flex-1 gap-2">
          <CategoryBadges category={category} />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {/* <Button variant={"default"} onClick={onEdit}>
          <Edit />
        </Button> */}
        <Alert onConfirm={onDelete} />
      </ItemActions>
    </Item>
  );
}
