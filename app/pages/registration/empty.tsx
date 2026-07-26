import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { UserPen } from "lucide-react";

export function EmptySubcribes() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserPen />
        </EmptyMedia>
        <EmptyTitle>Sem Inscrições</EmptyTitle>
        <EmptyDescription>
          Nenhuma inscrição foi encontrada até o momento.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Adicionar Inscrição</Button>
      </EmptyContent>
    </Empty>
  );
}
