import FormInput from "@/components/form/form-input";
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

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="competitorsPerRegistration"
          label="Competidores"
          description="Número de competidores por inscrição."
          type="number"
        />

        <FormInput
          control={control}
          name="pricePerRegistration"
          label="Preço (R$)"
          description="Preço por inscrição"
          type="number"
          placeholder="R$ 0,00"
        />
      </div>
    </FieldGroup>
  );
}
