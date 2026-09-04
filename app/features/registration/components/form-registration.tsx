import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { Category } from "@/features/categories/types/category";
import { useRegistration } from "../hooks/use-registration";
import { RegistrationConfirmation } from "./registration-confirmation";
import { RegistrationFields } from "./registration-fields";

interface FormRegistrationProps {
  category: Category;
}

export function FormRegistration({ category }: FormRegistrationProps) {
  const {
    form,
    onSubmit,
    onError,
    fields,
    isPending,
    createdRegistration,
    onNewRegistration,
    onComplete,
  } = useRegistration({
    category,
  });

  if (createdRegistration)
    return (
      <RegistrationConfirmation
        registration={createdRegistration}
        categoryName={category.name}
        onNewRegistration={onNewRegistration}
        onComplete={onComplete}
      />
    );

  return (
    <form
      id="registration-form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit, onError)}
    >
      <FormProvider {...form}>
        <RegistrationFields fields={fields} disabled={isPending} />
      </FormProvider>

      <p className="mt-4 text-sm text-muted-foreground">
        Após salvar, o número da inscrição será exibido para informar ao
        competidor.
      </p>
      <div className="mt-6 flex justify-end">
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
