import { useFormContext } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import FormSwitch from "@/components/shared/form/form-switch";
import { FieldGroup } from "@/components/ui/field";

interface FormCategoryQualificationProps {
  onDuelChange: (checked: boolean) => void;
}

export function FormCategoryQualification({
  onDuelChange,
}: FormCategoryQualificationProps) {
  const { control } = useFormContext();

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
        name="duel"
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
