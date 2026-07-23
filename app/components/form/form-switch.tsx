import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

type FormSwitchProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export default function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  onCheckedChange,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation={"horizontal"}>
          <Switch
            id={field.name}
            checked={field.value}
            onCheckedChange={(e) => {
              field.onChange(e);

              if (typeof onCheckedChange === "function") {
                onCheckedChange(e);
              }
            }}
            aria-invalid={fieldState.invalid}
          />
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
