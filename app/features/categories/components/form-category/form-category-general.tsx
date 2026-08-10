import FormInput from "@/components/shared/form/form-input";
import { FieldGroup } from "@/components/ui/field";
import type { CategorySchemaType } from "@/schemas/category-schema";
import type { Control } from "react-hook-form";

interface FormCategoryGeneralProps {
  control: Control<CategorySchemaType>;
}

export function FormCategoryGeneral({ control }: FormCategoryGeneralProps) {
  return (
    <FieldGroup>
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
