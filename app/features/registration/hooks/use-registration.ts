import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  type FieldErrors,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Category } from "@/features/categories/types/category";
import { groupKeys } from "@/features/competition/api/group-queries";
import {
  type CreateRegistrationInput,
  RegistrationSchema,
} from "@/features/registration/schemas/registration-schema";
import { formErrorMessages, requestErrorMessage } from "@/lib/form-errors";
import { createRegistration } from "../api/create-registration";

interface RegistrationProps {
  category: Category | null;
}

export function useRegistration({ category }: RegistrationProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<CreateRegistrationInput>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      categoryId: "",
      competitors: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "competitors",
  });

  const createMutation = useMutation({
    mutationFn: createRegistration,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (data.competitionId && data.groupId) {
        queryClient.invalidateQueries({
          queryKey: ["groups", data.competitionId],
        });
        queryClient.invalidateQueries({
          queryKey: groupKeys.group(data.competitionId, data.groupId),
        });
        queryClient.invalidateQueries({
          queryKey: groupKeys.rounds(data.competitionId, data.groupId),
        });
        queryClient.invalidateQueries({
          queryKey: ["group-registrations", data.competitionId, data.groupId],
        });
      }
      toast.success(`Inscrição nº ${data.number} realizada com sucesso`);
    },
    onError: (error) => {
      const message = requestErrorMessage(
        error,
        "Não foi possível realizar a inscrição. Confira os dados e tente novamente.",
      );
      form.setError("root.server", { message });
      toast.error(message);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: react-hook-forms methods
  useEffect(() => {
    if (!category) return;

    createMutation.reset();
    form.reset({
      categoryId: category.id,
      number: 1,
      competitors: Array.from(
        { length: category.competitorsPerRegistration },
        () => ({
          id: null,
          name: "",
          cpf: "",
        }),
      ),
    });
  }, [category?.id]);

  const onSubmit: SubmitHandler<CreateRegistrationInput> = (data) => {
    if (createMutation.isPending || createMutation.data) return;
    form.clearErrors("root");
    createMutation.mutate({
      ...data,
      name: data.competitors.length >= 4 ? data.name : undefined,
    });
  };

  const onNewRegistration = () => {
    if (!category || createMutation.isPending) return;
    createMutation.reset();
    form.reset({
      categoryId: category.id,
      number: 1,
      name: "",
      competitors: Array.from(
        { length: category.competitorsPerRegistration },
        () => ({ id: null, name: "", cpf: "" }),
      ),
    });
  };

  const onComplete = () => {
    navigate(
      createMutation.data?.competitionId
        ? `/competition/${createMutation.data.competitionId}`
        : "/registrations",
    );
  };

  const onError = (validationError: FieldErrors<CreateRegistrationInput>) => {
    toast.error(
      formErrorMessages(validationError)[0] ?? "Confira os campos indicados.",
    );
  };

  return {
    form,
    isPending: createMutation.isPending,
    onSubmit,
    onError,
    fields,
    createdRegistration: createMutation.data,
    onNewRegistration,
    onComplete,
  };
}
