import { FormProvider } from "react-hook-form";
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
import { useCategoryForm } from "@/features/categories/hooks/use-category-form";
import { FieldGroup } from "../../../components/ui/field";
import { FormCategoryFinal } from "./form-category/form-category-final";
import { FormCategoryGeneral } from "./form-category/form-category-general";
import { FormCategoryQualification } from "./form-category/form-category-qualification";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const {
    form,
    fields,
    append,
    remove,
    onSubmit,
    onError,
    onClose,
    onDuelChange,
  } = useCategoryForm({ onOpenChange });

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
                <FormCategoryGeneral />

                <FormCategoryQualification onDuelChange={onDuelChange} />

                <FormCategoryFinal
                  fields={fields}
                  remove={remove}
                  append={append}
                />
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
