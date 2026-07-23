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
import { FieldGroup } from "@/components/ui/field";
import { useCategories } from "@/context/categories";
import { zodResolver as ZodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  FormProvider,
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
import { FormRounds } from "../form-category/form-rounds";
import FormInput from "../form/form-input";
import FormSwitch from "../form/form-switch";
import { Card, CardContent, CardFooter } from "../ui/card";

const A_IN_CHARCODE = 65;

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

  const getForceName = (index: number) =>
    String.fromCharCode(A_IN_CHARCODE + index);

  const onClose = () => {
    setEditingCategory(undefined);
    onOpenChange(false);
    form.reset();
  };

  const onDuelChange = (checked: boolean) => {
    if (checked) {
      replace([
        { name: "A", rounds: [] },
        { name: "B", rounds: [] },
        { name: "C", rounds: [] },
      ]);
    } else {
      replace([]);
    }
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
            <FormProvider {...form}>
              <FieldGroup>
                <FormInput
                  control={form.control}
                  name="name"
                  label="Nome"
                  description="Nome da modalidade."
                  type="text"
                  placeholder="ex: Duelo, Duplas, Equipes..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name="competitors"
                    label="Competidores"
                    description="Número de competidores por inscrição."
                    type="number"
                  />

                  <FormInput
                    control={form.control}
                    name="rounds"
                    label="Voltas"
                    description="Número de voltas de classificatórias."
                    type="number"
                  />
                </div>

                <FormInput
                  control={form.control}
                  name="value"
                  label="Valor (R$)"
                  description="Valor da inscrição"
                  type="number"
                  placeholder="R$ 0,00"
                />

                <FormSwitch
                  control={form.control}
                  name="isDuel"
                  label="Duelo"
                  onCheckedChange={onDuelChange}
                />

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent>
                      <FormInput
                        control={form.control}
                        name={`forces.${index}.name`}
                        label="Nome da Força"
                        description="Nome da Força de classificação."
                        type="text"
                        placeholder={`padrão Força ${getForceName(index)}`}
                      />

                      <FormRounds
                        control={form.control}
                        name={`forces.${index}.rounds`}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="button"
                        variant={"destructive"}
                        onClick={() => remove(index)}
                        className={"w-full"}
                      >
                        <Trash2 />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {isDuel && (
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() =>
                      append({ name: getForceName(fields.length), rounds: [] })
                    }
                  >
                    <Plus /> Adicionar Força
                  </Button>
                )}
              </FieldGroup>
            </FormProvider>
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
