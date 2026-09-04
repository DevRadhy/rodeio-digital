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
import type { Category } from "@/features/categories/types/category";
import { useRegistration } from "../hooks/use-registration";
import { RegistrationConfirmation } from "./registration-confirmation";
import { RegistrationFields } from "./registration-fields";

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

  if (!category) return;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!isPending) onOpenChange(open);
      }}
    >
      <FormProvider {...form}>
        <form
          id="registration-dialog-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{category.name}</DialogTitle>
              <DialogDescription>Registre uma inscrição.</DialogDescription>
            </DialogHeader>
            {createdRegistration ? (
              <div className="max-h-[70vh] overflow-y-auto">
                <RegistrationConfirmation
                  registration={createdRegistration}
                  categoryName={category.name}
                  onNewRegistration={onNewRegistration}
                  onComplete={() => {
                    onOpenChange(false);
                    onComplete();
                  }}
                />
              </div>
            ) : (
              <>
                <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
                  <RegistrationFields fields={fields} disabled={isPending} />
                </div>
                <DialogFooter>
                  <DialogClose
                    render={
                      <Button
                        type="button"
                        disabled={isPending}
                        variant={"outline"}
                        onClick={() => onOpenChange(false)}
                      >
                        Cancelar
                      </Button>
                    }
                  />
                  <Button
                    type="submit"
                    form="registration-dialog-form"
                    disabled={isPending}
                  >
                    {isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
}
