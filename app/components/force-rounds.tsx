import { X } from "lucide-react";
import { useState } from "react";
import {
  useFormContext,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";

type ForceRoundsProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
};

export function ForceRounds<T extends FieldValues>({
  control,
  name,
}: ForceRoundsProps<T>) {
  const { setValue } = useFormContext();

  const rounds = useWatch({
    control,
    name,
  });

  console.log(rounds)

  const [round, setRound] = useState("");

  const addValue = () => {
    const value = Number(round);

    if (!Number.isFinite(value)) return;

    setValue(name, [...(rounds ?? []), value] as T[typeof name], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setRound("");
  };

  const removeValue = (index: number) => {
    setValue(
      name,
      (rounds ?? []).filter((_, i) => i !== index) as T[typeof name],
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
        <Field data-invalid={rounds.invalid}>
          <FieldLabel htmlFor={name}>Voltas</FieldLabel>
          <Input
            type="number"
            id={name}
            autoComplete="off"
            onChange={(e) => setRound(e.target.value)}
            value={round}
          />
          <FieldDescription>Voltas de classificatória.</FieldDescription>
        </Field>

        <Button type="button" onClick={addValue} className={"self-center"}>
          Adicionar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {rounds.map((round: number, index: number) => (
          <Button onClick={() => removeValue(index)} variant={"secondary"}>
            {round}
            <X />
          </Button>
        ))}
      </div>
    </div>
  );
}
