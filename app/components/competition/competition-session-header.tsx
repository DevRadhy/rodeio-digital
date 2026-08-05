import type { Category } from "@/types/category";
import type { Competition } from "@/types/competition";
import { formatPhase } from "@/utils";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CompetitionHeadeSessionrProps {
  competition: Competition;
  category: Category;
}

export function CompetitionSessionHeader({
  category,
  competition,
}: CompetitionHeadeSessionrProps) {
  const navigation = useNavigate();

  const phase = formatPhase(competition.phase);

  return (
    <div className="px-8 py-8">
      <Button
        variant={"ghost"}
        className="flex items-center gap-2 my-4 -ml-4 text-muted-foreground"
        onClick={() => navigation("/competition")}
      >
        <ChevronLeft /> Modalidades
      </Button>

      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <Badge className={`${phase.color} font-semibold text-muted`}>
          {phase.text}
        </Badge>
      </div>
    </div>
  );
}
