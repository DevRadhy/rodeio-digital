import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver as ZodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  Controller,
  useForm,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import {
  CategorySchema,
  type CategoryType,
} from "../../pages/categories/schema";

interface CategoryCardProps {
  handleSubmit: (data: CategoryType) => void;
}

export function CategoryCard({ handleSubmit }: CategoryCardProps) {
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
          handleSubmit(data);

          resolve(200);
        }, 1000);
      }),
      {
        loading: "Salvando dados.",
        success: "Modalidade criada com sucesso!",
        error: "Não foi possível criar modalidade, tente novamente.",
      },
    );
  };

  const onError = (validationError: FieldErrors<CategoryType>) => {
    const errors = Object.values(validationError);

    return toast.error(errors[0].message);
  };

  return (
    <Dialog>
      <form id="form" onSubmit={form.handleSubmit(onSubmit, onError)}>
        <DialogTrigger
          render={
            <Button variant="outline" onClick={() => form.reset()}>
              <Plus /> Criar Modalidade
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modalidade</DialogTitle>
            <DialogDescription>Registre uma modalidade.</DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <DialogClose
              render={
                <Button variant={"outline"} onClick={() => form.reset()}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" form="form">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
