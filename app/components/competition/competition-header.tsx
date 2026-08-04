import type { Category } from "@/types/category";
import type { CompetitionGroup } from "@/types/competition";

interface CompetitionHeaderProps {
  category: Category;
  group: CompetitionGroup;
}

export function CompetitionHeader({
  category,
  group,
}: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {group.currentRound} de {category.rounds}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
