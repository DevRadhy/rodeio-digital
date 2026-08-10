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
import { CompetitionService } from "@/services/competition-service";
import { useCompetitionSessionStore } from "@/stores/competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";
import { formatNumber } from "@/utils";
import { zodResolver as ZodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  RegistrationSchema,
  type RegistrationSchemaType,
} from "../../../schemas/registration-schema";
import FormInput from "../form/form-input";

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
  const addRegistration = useRegistrationStore(
    (state) => state.addRegistration,
  );
  const registrationsByCompetition = useRegistrationStore(
    (state) => state.registrationsByCompetition,
  );
  const getCompetition = useCompetitionSessionStore(
    (state) => state.getSession,
  );
  const updateCompetition = useCompetitionSessionStore(
    (state) => state.updateCompetition,
  );

  const form = useForm<RegistrationSchemaType>({
    resolver: ZodResolver(RegistrationSchema),
    defaultValues: {
      categoryId: "",
      competitors: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "competitors",
  });

  useEffect(() => {
    if (!category) return;

    form.reset({
      categoryId: category.id,
      competitors: Array.from(
        { length: category.competitorsPerRegistration },
        () => ({
          id: v4(),
          name: "",
        }),
      ),
    });
  }, [category]);

  const onSubmit: SubmitHandler<RegistrationSchemaType> = (data) => {
    if (!category) return;

    const registrations = registrationsByCompetition(category.id);
    const competition = getCompetition(category.id);

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const registration = {
            id: v4(),
            number: registrations.length + 1,
            ...data,
          };

          addRegistration(registration);

          if (competition) {
            const competitionRegistration = CompetitionService.addRegistration(
              competition,
              category,
              registration,
            );

            if (!competitionRegistration) return;

            updateCompetition(competitionRegistration);
          }

          resolve(true);
          onOpenChange(false);
        }, 200);
      }),
      {
        loading: "Salvando dados.",
        success: "Inscrição salva com sucesso!",
        error: "Não foi possível salvar a inscrição, tente novamente.",
      },
    );
  };

  const onError = (validationError: FieldErrors<RegistrationSchemaType>) => {
    const { categoryId, competitors } = validationError;

    if (categoryId) {
      return toast.error(categoryId.message);
    }

    if (competitors) {
      return toast.error("");
    }
  };

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
