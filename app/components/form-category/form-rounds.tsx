import { X } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  useFormContext,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type FormRoundsProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormRounds<T extends FieldValues>({
  control,
  name,
}: FormRoundsProps<T>) {
  const { setValue, watch } = useFormContext();

  const forceRounds = useWatch({
    control,
    name,
  });

  const rounds = watch("rounds");
  const forces = watch("forces");

  const [round, setRound] = useState("");
  const [error, setError] = useState("");

  const addValue = () => {
    const value = Number(round);

    if (!Number.isFinite(value)) return;

    if (value < 1 || value > rounds) {
      setError(`O número de armadas deve estar entre 1 e ${rounds}.`);
      return;
    }

    const valueAlreadyExists = forces.find(
      (force: { name: string; rounds: number[] }) =>
        force.rounds.some((round: number) => round === value),
    );

    if (valueAlreadyExists) {
      setError(
        `Esse valor já está sendo usando na força ${valueAlreadyExists.name}.`,
      );
      return;
    }

    setValue(name, [...(forceRounds ?? []), value] as T[typeof name], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setRound("");
  };

  const removeValue = (index: number) => {
    setValue(
      name,
      (forceRounds ?? []).filter((_, i) => i !== index) as T[typeof name],
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
            <Field data-invalid={forceRounds.invalid}>
              <FieldLabel htmlFor={name}>Voltas</FieldLabel>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <Input
                  {...field}
                  type="number"
                  id={field.name}
                  autoComplete="off"
                  onChange={(e) => {
                    setRound(e.target.value);
                    setError("");
                  }}
                  value={round}
                />
                <Button
                  type="button"
                  onClick={addValue}
                  className={"self-center"}
                >
                  Adicionar
                </Button>
              </div>
              <FieldDescription>Voltas de classificatória.</FieldDescription>
              {fieldState.invalid ||
                (error && (
                  <FieldError errors={[fieldState.error, { message: error }]} />
                ))}
            </Field>
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {forceRounds.map((round: number, index: number) => (
          <Button onClick={() => removeValue(index)} variant={"secondary"}>
            {round}
            <X />
          </Button>
        ))}
      </div>
    </div>
  );
}
