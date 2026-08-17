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
import type { Category } from "@/features/categories/types/category";
import { formatNumber } from "@/utils";
import FormInput from "../../../components/shared/form/form-input";
import { useRegistration } from "../hooks/use-registration";

interface RegistrationDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationDialog({
  category,
  open,
  onOpenChange,
}: RegistrationDialogProps) {
  const { form, onSubmit, onError, fields } = useRegistration({ category });

  if (!category) return;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form id="form" onSubmit={form.handleSubmit(onSubmit, onError)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{category.name}</DialogTitle>
            <DialogDescription>Registre uma inscrição.</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 max-w-lg">
            <FieldGroup>
              {category.competitorsPerRegistration >= 4 && (
                <FormInput
                  control={form.control}
                  name={`name`}
                  label={`Nome`}
                  description={`Dê um nome para inscrição.`}
                  type="text"
                  placeholder={"Digite o nome da entidade."}
                />
              )}
              {fields.map((field, index) => (
                <FormInput
                  key={field.id}
                  control={form.control}
                  name={`competitors.${index}.name`}
                  label={`Competidor ${category.competitorsPerRegistration > 1 ? formatNumber(index + 1) : ""}`}
                  description={`Nome do competidor.`}
                  type="text"
                  placeholder={"Digite o nome do competidor."}
                />
              ))}
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant={"outline"} onClick={() => onOpenChange(false)}>
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
