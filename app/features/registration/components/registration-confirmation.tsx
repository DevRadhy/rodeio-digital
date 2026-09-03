import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Registration } from "../types/registration";

export function RegistrationConfirmation({
  registration,
  categoryName,
  onNewRegistration,
  onComplete,
}: {
  registration: Registration;
  categoryName: string;
  onNewRegistration(): void;
  onComplete(): void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [registration.id]);
  return (
    <Card className="border-primary/30 ring-primary/20">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2 text-center">
          <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check aria-hidden="true" />
          </span>
          <h2 ref={heading} tabIndex={-1} className="text-2xl outline-none">
            Inscrição confirmada
          </h2>
          <p className="text-sm text-muted-foreground">
            Informe este número ao competidor para que ele acompanhe sua
            chamada.
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-6 text-center">
          <p className="text-sm font-medium text-primary">
            Número da inscrição
          </p>
          <p
            aria-label={`Número da inscrição: ${registration.number}`}
            className="mt-2 break-all font-mono text-6xl font-bold tabular-nums text-primary sm:text-7xl"
          >
            {registration.number}
          </p>
          <p className="mt-3 font-medium">{categoryName}</p>
          {registration.name && (
            <p className="text-sm text-muted-foreground">{registration.name}</p>
          )}
        </div>
        <ol
          aria-label="Competidores inscritos na ordem de julgamento"
          className="space-y-2"
        >
          {registration.competitors.map((competitor, index) => (
            <li
              key={`${competitor.id}-${index}`}
              className="flex items-start gap-3"
            >
              <span className="font-mono text-sm text-muted-foreground">
                {index + 1}.
              </span>
              <span className="min-w-0 break-words">{competitor.name}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onNewRegistration}>
            Cadastrar outra inscrição
          </Button>
          <Button type="button" onClick={onComplete}>
            Concluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
