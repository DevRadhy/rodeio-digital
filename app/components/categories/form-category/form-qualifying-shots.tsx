import type { Group } from "@/types/category";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  useFormContext,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { ButtonGroup } from "@/components/ui/button-group";

type FormQualifyingShotsProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormQualifyingShots<T extends FieldValues>({
  control,
  name,
}: FormQualifyingShotsProps<T>) {
  const { setValue, watch, setError } = useFormContext();

  const groupRounds = useWatch({
    control,
    name,
  });

  const rounds = watch("qualification.rounds");
  const competitorsPerRegistration = watch("competitorsPerRegistration");
  const groups = watch("groups");

  const [round, setRound] = useState("");

  const addValue = () => {
    const value = Number(round);

    if (!Number.isFinite(value)) return;

    if (value < 1 || value > competitorsPerRegistration * rounds) {
      setError(name, {
        message: `O número de armadas deve estar entre 1 e ${competitorsPerRegistration * rounds}.`,
      });
      return;
    }

    const valueAlreadyExists = groups?.find((group: Group) =>
      group.qualifyingShots.some((round: number) => round === value),
    );

    if (valueAlreadyExists) {
      setError(name, {
        message: `Esse valor já está sendo usando na força ${valueAlreadyExists.name}.`,
      });
      return;
    }

    setValue(name, [...(groupRounds ?? []), value] as T[typeof name], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setRound("");
  };

  const removeValue = (index: number) => {
    setValue(
      name,
      (groupRounds ?? []).filter((_, i) => i !== index) as T[typeof name],
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={groupRounds.invalid}>
              <FieldLabel htmlFor={name}>Armadas de Classificatória</FieldLabel>
              <ButtonGroup>
                <Input
                  {...field}
                  type="number"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  onChange={(e) => {
                    setRound(e.target.value);
                  }}
                  value={round}
                />
                <Button
                  type={"button"}
                  onClick={addValue}
                  className={"self-center"}
                  variant={"outline"}
                  aria-invalid={fieldState.invalid}
                >
                  <Plus /> Adicionar
                </Button>
              </ButtonGroup>
              <FieldDescription>Armadas necessárias para classificar no grupo.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {groupRounds.map((round: number, index: number) => (
          <Button onClick={() => removeValue(index)} variant={"secondary"}>
            {round}
            <X />
          </Button>
        ))}
      </div>
    </div>
  );
}
