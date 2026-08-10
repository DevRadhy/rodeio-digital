import type { Category } from "@/types/category";
import { formatCurrency } from "@/utils";
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

      {/* <Badge variant={"secondary"}>
        {category.qualification.qualifyingRounds} voltas
      </Badge>

      {category.qualification.elimination && (
        <Badge variant={"destructive"}>eliminatória</Badge>
      )} */}

      {category.duel && <Badge variant={"default"}>Duelo</Badge>}
    </>
  );
}
