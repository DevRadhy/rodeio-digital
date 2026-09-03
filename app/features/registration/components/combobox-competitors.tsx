import { useEffect, useState } from "react";
import { Check, Search, UserRoundPlus } from "lucide-react";
import {
  Controller,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { InputGroupAddon } from "@/components/ui/input-group";
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
import { formErrorMessages } from "@/lib/form-errors";
import { useCompetitors } from "../hooks/use-competitors";
import type { CreateRegistrationInput } from "../schemas/registration-schema";

interface Props {
  control: Control<CreateRegistrationInput>;
  name: `competitors.${number}`;
  order: number;
  disabled?: boolean;
}
export function ComboboxCompetitors({ control, name, order, disabled }: Props) {
  const { setValue } = useFormContext<CreateRegistrationInput>();
  const [open, setOpen] = useState(false);
  const value = useWatch({ control, name });
  const inputValue = value?.name ?? "";
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(inputValue.trim()), 300);
    return () => clearTimeout(timeout);
  }, [inputValue]);
  const {
    data: competitors = [],
    isFetching,
    isError,
  } = useCompetitors(debounced);
  const searching = inputValue.trim() !== debounced || isFetching;
  const items = inputValue.trim() === debounced ? competitors : [];
  const selected = Boolean(value?.id);
  const hasName = inputValue.trim().length >= 2;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="min-w-0 gap-2">
          <FieldLabel htmlFor={`${name}.name`}>
            Nome{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </FieldLabel>
          <Combobox
            items={items}
            open={open}
            onOpenChange={setOpen}
            disabled={disabled}
            itemToStringLabel={(item) => item.name}
            isItemEqualToValue={(item, selectedValue) =>
              item.id === selectedValue.id
            }
            value={selected ? field.value : null}
            inputValue={inputValue}
            onValueChange={(next) => {
              if (next) {
                field.onChange({
                  id: next.id,
                  name: next.name,
                  cpf: next.cpf ?? "",
                });
                setValue(`${name}.cpf`, next.cpf ?? "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
            onInputValueChange={(next, { reason }) => {
              if (reason !== "input-change" && reason !== "clear-press") return;
              setOpen(true);
              const wasSelected = Boolean(field.value?.id);
              field.onChange({
                id: null,
                name: next,
                cpf: field.value?.id ? "" : (field.value?.cpf ?? ""),
              });
              if (wasSelected)
                setValue(`${name}.cpf`, "", { shouldDirty: true });
            }}
          >
            <ComboboxInput
              id={`${name}.name`}
              aria-label={`Nome do competidor ${order}`}
              aria-required="true"
              aria-describedby={`${name}-feedback`}
              disabled={disabled}
              onBlur={field.onBlur}
              ref={field.ref}
              placeholder="Busque ou digite o nome"
              aria-invalid={fieldState.invalid}
              showTrigger={false}
              className="h-10 rounded-lg bg-card"
            >
              <InputGroupAddon align="inline-start">
                <Search aria-hidden="true" />
              </InputGroupAddon>
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty
                role={isError ? "alert" : "status"}
                className={`p-3 text-sm italic ${isError ? "text-destructive" : "text-muted-foreground"}`}
              >
                {searching
                  ? "Buscando competidores..."
                  : isError
                    ? "Não foi possível consultar os cadastros. Tente buscar novamente."
                    : hasName
                      ? "Nenhum competidor encontrado — um novo será criado com esse nome ao salvar."
                      : "Digite o nome para buscar um competidor."}
              </ComboboxEmpty>
              <ComboboxList>
                {items.map((competitor) => (
                  <ComboboxItem
                    key={competitor.id}
                    value={competitor}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span>{competitor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Já cadastrado
                      {competitor.cpf
                        ? ` · CPF ${competitor.cpf}`
                        : " · CPF não informado"}
                    </span>
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <div id={`${name}-feedback`} role="status" className="min-h-6">
            {selected ? (
              <Badge
                variant="outline"
                className="h-auto max-w-full gap-1 border-transparent bg-primary/10 py-1 text-xs whitespace-normal text-primary"
              >
                <Check aria-hidden="true" />
                Competidor existente selecionado
              </Badge>
            ) : hasName ? (
              <Badge
                variant="outline"
                className="h-auto max-w-full gap-1 border-transparent bg-rope/15 py-1 text-xs whitespace-normal text-rope-ink"
              >
                <UserRoundPlus aria-hidden="true" />
                Será criado um novo competidor ao enviar
              </Badge>
            ) : (
              <FieldDescription>
                Selecione um cadastro ou digite um novo nome.
              </FieldDescription>
            )}
          </div>
          {fieldState.invalid && (
            <FieldError>
              {formErrorMessages(fieldState.error).join(" ")}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
}
