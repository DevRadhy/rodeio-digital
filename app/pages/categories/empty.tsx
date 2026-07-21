import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileCog } from "lucide-react";

type EmptyProps = {
  children: React.ReactNode;
};

export function EmptyCategories({ children }: EmptyProps) {
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
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  );
}
