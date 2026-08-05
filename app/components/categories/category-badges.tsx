import type { Category } from "@/types/category";
import type { Registration } from "@/types/registration";
import { formatCurrency } from "@/utils";
import { Badge } from "../ui/badge";

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
    <>
      <Badge variant={"secondary"}>
        {category.competitorsPerRegistration} competidor(es)
      </Badge>

      <Badge variant={"secondary"}>
        {category.qualification.qualifyingRounds} voltas
      </Badge>

      {category.qualification.elimination && (
        <Badge variant={"destructive"}>eliminatória</Badge>
      )}

      {category.pricePerRegistration ? (
        <Badge variant={"secondary"}>
          {formatCurrency(category.pricePerRegistration)}
        </Badge>
      ) : (
        <Badge>Gratuito</Badge>
      )}

      {category.final.duel && <Badge variant={"default"}>Duelo</Badge>}

      <Badge>{registrationsCount} Inscrições</Badge>
    </>
  );
}
