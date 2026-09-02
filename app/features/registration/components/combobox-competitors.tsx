/** biome-ignore-all lint/suspicious/noExplicitAny: react-hook-form setValue */

import { useEffect, useState } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import type { Competitor } from "@/types/competitor";
import { useCompetitors } from "../hooks/use-competitors";

type ComboboxCompetitorsProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
  description: string;
};

export function ComboboxCompetitors<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: ComboboxCompetitorsProps<T>) {
  const { setValue } = useFormContext();

  const [inputValue, setInputValue] = useState("");
  const [debounced, setDebouced] = useState("");

  const { data: competitors = [], isFetching } = useCompetitors(debounced);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouced(inputValue), 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Combobox
            items={competitors}
            itemToStringLabel={(c) => c.name}
            value={field.value as Competitor}
            onValueChange={(next) => {
              if (!next) return;

              field.onChange({
                id: next.id,
                name: next.name,
                cpf: next.cpf ?? "",
              });

              setValue(`${name}.cpf`, (next.cpf ?? "") as any, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            onInputValueChange={(next, { reason }) => {
              setInputValue(next);

              if (reason === "item-press") return;

              field.onChange({
                id: null,
                name: next,
                cpf: null,
              });

              setValue(`${name}.cpf`, "" as any);
            }}
          >
            <ComboboxInput
              placeholder="Buscar competidor..."
              aria-invalid={!!fieldState.error}
            />
            <ComboboxContent>
              {isFetching && (
                <ComboboxEmpty>Buscando competidores...</ComboboxEmpty>
              )}
              {!isFetching && competitors.length === 0 && (
                <ComboboxEmpty>Competidor não encontrado.</ComboboxEmpty>
              )}
              <ComboboxList>
                {competitors?.map((competitor) => (
                  <ComboboxItem
                    key={competitor.id}
                    value={competitor}
                    className={"flex flex-col items-start gap-0"}
                  >
                    {competitor.name}
                    {competitor.cpf && (
                      <span className="text-muted-foreground text-xs">
                        {competitor.cpf}
                      </span>
                    )}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <FieldDescription>{description}</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
