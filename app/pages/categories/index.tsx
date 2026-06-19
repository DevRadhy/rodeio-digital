import { zodResolver as ZodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Route } from "../../pages/categories/+types";
import { CategorySchema, type CategoryType } from "./schema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Modalidades" },
    {
      name: "Crie uma nova modalidade.",
      content: "Crie, edite e reoganize as modalidades do seu evento.",
    },
  ];
}

export default function Home() {
  const form = useForm<CategoryType>({
    resolver: ZodResolver(CategorySchema),
    defaultValues: {
      name: "",
      competitors: 1,
      rounds: 1,
    },
  });

  const onSubmit: SubmitHandler<CategoryType> = (data) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(200);
        }, 1000);
      }),
      {
        loading: "Salvando dados.",
        success: "Modalidade criada com sucesso!",
        error: "Não foi possível criar modalidade, tente novamente.",
      },
    );

    console.log(data);

    return;
  };

  const onError = (validationError: FieldErrors<CategoryType>) => {
    const errors = Object.values(validationError);

    return toast.error(errors[0].message);
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Modalidade</CardTitle>
        <CardDescription>Registre uma modalidade.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form" onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="ex: Duelo, Duplas, Equipes..."
                    autoComplete="off"
                  />
                  <FieldDescription>Nome da modalidade.</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="competitors"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Competidores</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FieldDescription>
                      Número de competidores por inscrição.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="rounds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Voltas</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FieldDescription>
                      Número de voltas como classificatórias.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation={"horizontal"} className="flex justify-end">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => form.reset()}
          >
            Cancelar
          </Button>
          <Button type="submit" form="form">
            Salvar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
