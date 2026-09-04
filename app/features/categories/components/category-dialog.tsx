import { FormProvider } from "react-hook-form";
import { FormErrors } from "@/components/shared/form/form-errors";
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
    isPending,
    fields,
    append,
    remove,
    onSubmit,
    onError,
    onClose,
    onCategoryTypeChange,
  } = useCategoryForm({ onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form
        id="category-form"
        noValidate
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova modalidade</DialogTitle>
            <DialogDescription>
              Configure a inscrição, a classificatória e a final. Os campos são
              validados antes do cadastro.
            </DialogDescription>
          </DialogHeader>
          <div className="-mx-2 max-h-[65vh] overflow-y-auto px-2">
            <FormProvider {...form}>
              <FieldGroup className="gap-5">
                <FormErrors errors={form.formState.errors} />
                <section className="space-y-4 rounded-2xl border p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      1. Informações gerais
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Defina como as inscrições serão formadas.
                    </p>
                  </div>
                  <FormCategoryGeneral
                    onCategoryTypeChange={onCategoryTypeChange}
                  />
                </section>
                <section className="space-y-4 rounded-2xl border p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      2. Classificatória
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Informe o formato das voltas e dos pelotões.
                    </p>
                  </div>
                  <FormCategoryQualification />
                </section>
                <section className="space-y-4 rounded-2xl border p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      3. Final
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Configure forças, cortes e bônus da decisão.
                    </p>
                  </div>
                  <FormCategoryFinal
                    fields={fields}
                    remove={remove}
                    append={append}
                  />
                </section>
              </FieldGroup>
            </FormProvider>
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" form="category-form" disabled={isPending}>
              {isPending ? "Criando…" : "Criar modalidade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
