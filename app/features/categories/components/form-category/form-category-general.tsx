import { Controller, useFormContext } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CategoryType } from "../../types/category";

export function FormCategoryGeneral({
  onCategoryTypeChange,
}: {
  onCategoryTypeChange(type: CategoryType): void;
}) {
  const { control } = useFormContext();

  return (
    <FieldGroup>
      <Controller
        control={control}
        name="categoryType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="categoryType">Tipo da modalidade</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              items={[
                { value: "normal", label: "Normal" },
                { value: "elimination", label: "Eliminatória" },
                { value: "summation", label: "Somatória" },
                { value: "duel", label: "Duelo por Forças" },
              ]}
              onValueChange={(value) => {
                if (value) onCategoryTypeChange(value as CategoryType);
              }}
            >
              <SelectTrigger
                id="categoryType"
                className="w-full"
                aria-invalid={fieldState.invalid}
                onBlur={field.onBlur}
                ref={field.ref}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="elimination">Eliminatória</SelectItem>
                <SelectItem value="summation">Somatória</SelectItem>
                <SelectItem value="duel">Duelo por Forças</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <FormInput
        control={control}
        name="name"
        label="Nome"
        description="Nome da modalidade."
        type="text"
        placeholder="ex: Duelo, Duplas, Equipes..."
      />

      <FormInput
        control={control}
        name="competitorsPerRegistration"
        label="Competidores"
        description="Número de competidores por inscrição."
        type="number"
      />
    </FieldGroup>
  );
}
