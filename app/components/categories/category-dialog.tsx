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
import { useCategoryStore } from "@/stores/category";
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
  type CategorySchemaType,
} from "../../schemas/category-schema";
import FormInput from "../form/form-input";
import FormSwitch from "../form/form-switch";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FormRounds } from "./form-category/form-rounds";

const A_IN_CHARCODE = 65;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const { editingCategory, updateCategory, addCategory, setEditingCategory } =
    useCategoryStore();

  const form = useForm<CategorySchemaType>({
    resolver: ZodResolver(CategorySchema),
    defaultValues: {
      name: "",
      competitorsPerRegistration: 1,
      duel: false,
      qualification: {
        rounds: 1,
        groups: [],
      },
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "qualification.groups",
  });

  const isDuel = form.watch("duel");

  useEffect(() => {
    if (editingCategory) {
      form.reset(editingCategory);
    } else {
      form.reset({
        name: "",
        competitorsPerRegistration: 1,
        duel: false,
        qualification: {
          rounds: 1,
          groups: [],
        },
      });
    }
  }, [open, editingCategory]);

  const onSubmit: SubmitHandler<CategorySchemaType> = (data) => {
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

  const onError = (validationError: FieldErrors<CategorySchemaType>) => {
    const errors = Object.values(validationError);

    console.log(validationError);

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
        { id: v4(), name: "A", qualifyingScores: [] },
        { id: v4(), name: "B", qualifyingScores: [] },
        { id: v4(), name: "C", qualifyingScores: [] },
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
                    name="competitorsPerRegistration"
                    label="Competidores"
                    description="Número de competidores por inscrição."
                    type="number"
                  />

                  <FormInput
                    control={form.control}
                    name="qualification.rounds"
                    label="Voltas"
                    description="Número de voltas de classificatórias."
                    type="number"
                  />
                </div>

                <FormInput
                  control={form.control}
                  name="pricePerRegistration"
                  label="Valor (R$)"
                  description="Valor da inscrição"
                  type="number"
                  placeholder="R$ 0,00"
                />

                <FormSwitch
                  control={form.control}
                  name="duel"
                  label="Duelo"
                  onCheckedChange={onDuelChange}
                />

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent>
                      <FormInput
                        control={form.control}
                        name={`qualification.groups.${index}.name`}
                        label="Nome da Força"
                        description="Nome da Força de classificação."
                        type="text"
                        placeholder={`padrão Força ${getForceName(index)}`}
                      />

                      <FormRounds
                        control={form.control}
                        name={`qualification.groups.${index}.qualifyingScores`}
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
                      append({
                        id: v4(),
                        name: getForceName(fields.length),
                        qualifyingScores: [],
                      })
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
