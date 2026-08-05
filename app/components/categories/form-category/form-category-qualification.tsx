import FormInput from "@/components/form/form-input";
import FormSwitch from "@/components/form/form-switch";
import { FieldGroup } from "@/components/ui/field";
import type { CategorySchemaType } from "@/schemas/category-schema";
import type { Control } from "react-hook-form";

interface FormCategoryQualificationProps {
  control: Control<CategorySchemaType>;
  onDuelChange: (checked: boolean) => void;
}

export function FormCategoryQualification({
  control,
  onDuelChange,
}: FormCategoryQualificationProps) {
  return (
    <FieldGroup>
      <FormInput
        control={control}
        name="qualification.qualifyingRounds"
        label="Voltas de Classificatória"
        description="Número de voltas de classificatórias."
        type="number"
      />

      <FormSwitch
        control={control}
        name="final.duel"
        label="Duelo"
        onCheckedChange={onDuelChange}
      />

      <FormSwitch
        control={control}
        name="qualification.elimination"
        label="Eliminatória"
      />
    </FieldGroup>
  );
}
