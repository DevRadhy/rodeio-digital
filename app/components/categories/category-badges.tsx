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
      <Badge variant={"secondary"}>{category.competitorsPerRegistration} competidor(es)</Badge>

      <Badge variant={category.qualification.rounds <= 1 ? "destructive" : "secondary"}>
        {category.qualification.rounds <= 1 ? "eliminatória" : `${category.qualification.rounds} voltas`}
      </Badge>

      {category.pricePerRegistration ? (
        <Badge variant={"secondary"}>{formatCurrency(category.pricePerRegistration)}</Badge>
      ) : (
        <Badge>Gratuito</Badge>
      )}

      <Badge>{registrationsCount} Inscrições</Badge>

      {category.duel && <Badge variant={"default"}>Duelo</Badge>}
    </div>
  );
}
