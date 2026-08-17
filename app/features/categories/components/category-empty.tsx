import { FileCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyProps {
  onAction: () => void;
}

export function EmptyCategories({ onAction }: EmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileCog />
        </EmptyMedia>
        <EmptyTitle>Sem Modalidades</EmptyTitle>
        <EmptyDescription>
          Nenhuma modalidade foi encontrada até o momento.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAction}>Adicionar Modalidade</Button>
      </EmptyContent>
    </Empty>
  );
}
