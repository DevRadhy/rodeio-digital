import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  backTo,
  backLabel = "Voltar",
  children,
}: {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  children?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="space-y-4 py-4">
      {backTo && (
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 gap-2 text-muted-foreground"
          onClick={() => navigate(backTo)}
          aria-label={`Voltar para ${backLabel}`}
        >
          <ChevronLeft aria-hidden="true" />
          {backLabel}
        </Button>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="break-words font-display text-[2.5rem] font-extrabold uppercase leading-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
    </header>
  );
}
