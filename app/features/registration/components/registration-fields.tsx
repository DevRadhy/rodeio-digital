import { Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormErrors } from "@/components/shared/form/form-errors";
import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import type { CreateRegistrationInput } from "../schemas/registration-schema";
import { ComboboxCompetitors } from "./combobox-competitors";

export function RegistrationFields({
  fields,
  disabled,
}: {
  fields: { id: string }[];
  disabled: boolean;
}) {
  const form = useFormContext<CreateRegistrationInput>();
  const competitors = useWatch({ control: form.control, name: "competitors" });
  return (
    <FieldGroup>
      <FormErrors errors={form.formState.errors} />
      {fields.length >= 4 && (
        <FormInput
          control={form.control}
          name="name"
          label="Nome da inscrição"
          description="Dê um nome para identificar a inscrição."
          type="text"
          placeholder="Digite o nome da entidade"
          disabled={disabled}
        />
      )}
      <section
        aria-label="Competidores na ordem da inscrição"
        className="rounded-2xl border bg-card px-4 sm:px-5"
      >
        {fields.map((field, index) => {
          const competitor = competitors?.[index];
          const selected = Boolean(competitor?.id);
          return (
            <div
              key={field.id}
              role="group"
              aria-label={`Competidor ${index + 1}`}
              className="grid grid-cols-[1.5rem_minmax(0,1fr)_2.5rem] items-start gap-x-3 gap-y-3 border-b py-5 last:border-b-0 sm:grid-cols-[1.5rem_minmax(0,1.4fr)_minmax(0,1fr)_2.5rem]"
            >
              <span
                aria-label={`Posição ${index + 1}`}
                className="mt-8 flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary"
              >
                {index + 1}
              </span>
              <ComboboxCompetitors
                control={form.control}
                name={`competitors.${index}`}
                order={index + 1}
                disabled={disabled}
              />
              <div className="col-start-2 row-start-2 min-w-0 sm:col-start-3 sm:row-start-1">
                <FormInput
                  control={form.control}
                  name={`competitors.${index}.cpf`}
                  label="CPF (opcional)"
                  aria-label={`CPF do competidor ${index + 1}`}
                  description={
                    selected
                      ? competitor?.cpf
                        ? "CPF vinculado ao cadastro existente"
                        : "Cadastro existente sem CPF informado"
                      : "Opcional para novos competidores"
                  }
                  type="text"
                  placeholder="000.000.000-00"
                  disabled={disabled || selected}
                  className="h-10 rounded-lg bg-card font-mono disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="col-start-3 row-start-1 mt-7 rounded-lg sm:col-start-4"
                aria-label={`Limpar competidor ${index + 1}`}
                title="Limpar seleção e dados deste competidor"
                disabled={
                  disabled ||
                  (!competitor?.name && !competitor?.cpf && !competitor?.id)
                }
                onClick={() => {
                  form.setValue(
                    `competitors.${index}`,
                    { id: null, name: "", cpf: "" },
                    { shouldDirty: true },
                  );
                  form.clearErrors(`competitors.${index}`);
                  form.setFocus(`competitors.${index}`);
                }}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          );
        })}
      </section>
      <p className="text-sm text-muted-foreground">
        A ordem dos campos define a ordem de julgamento dos {fields.length}{" "}
        competidor(es) desta inscrição.
      </p>
    </FieldGroup>
  );
}
