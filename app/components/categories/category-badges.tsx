import type { Category } from "@/types/category";
import type { Registration } from "@/types/registration";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils";

interface CategoryBadgesProps {
  category: Category;
  registrations: Registration[];
}

export function CategoryBadges({
  category,
  registrations,
}: CategoryBadgesProps) {
  const registrationsCount = registrations.length;

  return (
    <div className="flex flex-wrap items-center flex-1 gap-2">
      <Badge variant={"secondary"}>{category.competitors} competidor(es)</Badge>

      <Badge variant={category.rounds <= 1 ? "destructive" : "secondary"}>
        {category.rounds <= 1 ? "eliminatória" : `${category.rounds} voltas`}
      </Badge>

      {category.price ? (
        <Badge variant={"secondary"}>{formatCurrency(category.price)}</Badge>
      ) : (
        <Badge>Gratuito</Badge>
      )}

      <Badge>{registrationsCount} Inscrições</Badge>

      {category.isDuel && <Badge variant={"default"}>Duelo</Badge>}
    </div>
  );
}
