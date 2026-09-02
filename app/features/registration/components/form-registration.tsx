import { FormErrors } from "@/components/shared/form/form-errors";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import type { Category } from "@/features/categories/types/category";
import FormInput from "../../../components/shared/form/form-input";
import { useRegistration } from "../hooks/use-registration";
import { ComboboxCompetitors } from "./combobox-competitors";

interface FormRegistrationProps {
  category: Category;
}

export function FormRegistration({ category }: FormRegistrationProps) {
  const { form, onSubmit, onError, fields, isPending } = useRegistration({
    category,
  });

  return (
    <form
      id="registration-form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit, onError)}
    >
      <FormProvider {...form}>
        <FieldGroup>
          <FormErrors errors={form.formState.errors} />
          <FormInput
            control={form.control}
            name={`name`}
            label={`Nome`}
            description={`Dê um nome para inscrição.`}
            type="text"
            placeholder={"Digite o nome da entidade."}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-4 sm:flex-row">
              <ComboboxCompetitors
                control={form.control}
                name={`competitors.${index}`}
                description="Busque pelo competidor."
                label="Competidor"
              />

              <FormInput
                control={form.control}
                name={`competitors.${index}.cpf`}
                label={`CPF (opcional)`}
                description={`CPF do competidor.`}
                type="text"
                placeholder={"Digite o cpf do competidor."}
              />
            </div>
          ))}
        </FieldGroup>
      </FormProvider>

      <div className="flex justify-end">
        <Button
          type="submit"
          form="registration-form"
          size={"lg"}
          disabled={isPending}
        >
          {isPending ? "Salvando..." : "Salvar Inscrição"}
        </Button>
      </div>
    </form>
  );
}
