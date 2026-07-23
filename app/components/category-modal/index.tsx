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
import { useCategories } from "@/context/categories";
import { zodResolver as ZodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  CategorySchema,
  type CategoryType,
} from "../../schemas/category-schema";
import { Switch } from "../ui/switch";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryModal({ open, onOpenChange }: CategoryModalProps) {
  const { editingCategory, updateCategory, addCategory, setEditingCategory } =
    useCategories();

  const form = useForm<CategoryType>({
    resolver: ZodResolver(CategorySchema),
    defaultValues: {
      name: "",
      competitors: 1,
      rounds: 1,
      isDuel: false,
      forces: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "forces",
  });

  const isDuel = form.watch("isDuel");

  useEffect(() => {
    if (editingCategory) {
      form.reset(editingCategory);
    } else {
      form.reset({
        name: "",
        competitors: 1,
        rounds: 1,
        isDuel: false,
        forces: [],
      });
    }
  }, [open, editingCategory]);

  useEffect(() => {
    if (isDuel) {
      replace([
        { name: "A", rounds: 0 },
        { name: "B", rounds: 0 },
        { name: "C", rounds: 0 },
      ]);
    } else {
      replace([]);
    }
  }, [isDuel]);

  const onSubmit: SubmitHandler<CategoryType> = (data) => {
    toast.promise(
      new Promise((resolve) => {
        console.log(data);
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
          onClose();
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

  const getForceName = (index: number) => String.fromCharCode(65 + index);

  const onClose = () => {
    setEditingCategory(undefined);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form id="form" onSubmit={form.handleSubmit(onSubmit, onError)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modalidade</DialogTitle>
            <DialogDescription>Registre uma modalidade.</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 max-w-lg">
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
              <Controller
                name="value"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Valor (R$)</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="R$ 0,00"
                      autoComplete="off"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FieldDescription>Valor da inscrição.</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="isDuel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel htmlFor={field.name}>Duelo</FieldLabel>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Forças do Duelo */}
              {fields.map((field, index) => (
                <div
                  className="grid grid-cols-[1fr_1fr_auto] gap-4"
                  key={field.id}
                >
                  <Controller
                    name={`forces.${index}.name`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Nome da Força
                        </FieldLabel>
                        <Input
                          type="text"
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                        <FieldDescription>
                          Nome da Força de classificação.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`forces.${index}.rounds`}
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                        <FieldDescription>
                          Número de voltas de classificação da Força.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => remove(index)}
                    className={"mt-8"}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}

              {isDuel && (
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() =>
                    append({ name: getForceName(fields.length), rounds: 0 })
                  }
                >
                  <Plus /> Adicionar Força
                </Button>
              )}
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant={"outline"} onClick={onClose}>
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
