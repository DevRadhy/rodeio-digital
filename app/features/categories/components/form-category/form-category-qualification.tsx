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
      <div className="flex gap-4">
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
