import { useFormContext } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import { FieldGroup } from "@/components/ui/field";

export function FormCategoryGeneral() {
  const { control } = useFormContext();

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
