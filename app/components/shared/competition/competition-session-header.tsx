import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import type { Category } from "@/types/category";
import { Button } from "../../ui/button";

interface CompetitionHeadeSessionrProps {
  category: Category;
}

export function CompetitionSessionHeader({
  category,
}: CompetitionHeadeSessionrProps) {
  const navigation = useNavigate();

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
      </div>
    </div>
  );
}
