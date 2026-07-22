import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCompetition } from "@/context/competition";
import { zodResolver as ZodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
} from "../../schemas/category-schema";
import { v4 } from "uuid";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryModal({ open, onOpenChange }: CategoryModalProps) {
  const { editingCategory, updateCategory, addCategory, setEditingCategory } =
    useCompetition();

  const form = useForm<CategoryType>({
    resolver: ZodResolver(CategorySchema),
    defaultValues: {
      name: "",
      competitors: 1,
      rounds: 1,
    },
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset(editingCategory);
    } else {
      form.reset({
        name: "",
        competitors: 1,
        rounds: 1,
      });
    }
  }, [editingCategory]);

  const onSubmit: SubmitHandler<CategoryType> = (data) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          if (editingCategory) {
            updateCategory({
              ...editingCategory,
              ...data,
            });
          } else {
            addCategory({
              id: v4(),
              ...data,
            });
          }

          resolve(true);
          setEditingCategory(undefined);
          onOpenChange(false);
          form.reset();
        }, 200);
      }),
      {
        loading: "Salvando dados.",
        success: "Modalidade salva com sucesso!",
        error: "Não foi possível salvar a modalidade, tente novamente.",
      },
    );
  };

  const onError = (validationError: FieldErrors<CategoryType>) => {
    const errors = Object.values(validationError);

    return toast.error(errors[0].message);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form id="form" onSubmit={form.handleSubmit(onSubmit, onError)}>
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
                      Número de voltas de classificatórias.
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
