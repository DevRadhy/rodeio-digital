import { useFormContext } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import { FieldGroup } from "@/components/ui/field";

export function FormCategoryQualification() {
  const { control } = useFormContext();

  return (
    <FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          control={control}
          name="qualification.rounds"
          label="Voltas de Classificatória"
          description="Número de voltas de classificatórias."
          type="number"
        />

        <FormInput
          control={control}
          name="qualification.pelotonSize"
          label="Tamanho do Pelotão"
          description="Número de inscrições por pelotão."
          placeholder="ex: 10, 20"
          type="number"
        />
      </div>
    </FieldGroup>
  );
}
