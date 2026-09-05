import { Swords, Users } from "lucide-react";
import { CategoryBadges } from "@/components/shared/categories/category-badges";
import { CompetitionBadges } from "@/components/shared/competition-badges";
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
  onDelete?: () => void;
}

export function CategoryItem({ category, onDelete }: CategoryItemProps) {
  return (
    <Item variant={"outline"}>
      <ItemMedia variant={"icon"}>
        {category.categoryType === "duel" ? <Swords /> : <Users />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{category.name}</ItemTitle>
        <ItemDescription className="flex flex-wrap items-center flex-1 gap-2">
          <CategoryBadges category={category} />
          <CompetitionBadges
            status={category.session?.status}
            phase={category.session?.phase}
          />
        </ItemDescription>
      </ItemContent>
      {onDelete && (
        <ItemActions>
          <Alert onConfirm={onDelete} />
        </ItemActions>
      )}
    </Item>
  );
}
