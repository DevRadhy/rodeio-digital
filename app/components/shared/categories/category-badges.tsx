import type { Category } from "@/features/categories/types/category";
import { Badge } from "../../ui/badge";

interface CategoryBadgesProps {
  category: Category;
}

export function CategoryBadges({ category }: CategoryBadgesProps) {
  return (
    <>
      <Badge variant={"secondary"}>
        {category.competitorsPerRegistration} competidor(es)
      </Badge>

      {<Badge variant={"secondary"}>{category.qualifyingRounds} voltas</Badge>}

      <Badge variant="default">
        {
          {
            normal: "Normal",
            elimination: "Eliminatória",
            summation: "Somatória",
            duel: "Duelo por Forças",
          }[category.categoryType]
        }
      </Badge>
    </>
  );
}
