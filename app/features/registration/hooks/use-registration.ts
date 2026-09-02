import { isAxiosError } from "axios";
import { groupKeys } from "@/features/competition/api/group-queries";
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
import {
  type CreateRegistrationInput,
  RegistrationSchema,
} from "@/features/registration/schemas/registration-schema";
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
      toast.success("Inscrição realizada com sucesso");
      navigate(
        data.competitionId
          ? `/competition/${data.competitionId}`
          : "/registrations",
      );
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(
        typeof message === "string"
          ? message
          : "Não foi possível realizar a inscrição. Confira os dados e tente novamente.",
      );
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: react-hook-forms methods
  useEffect(() => {
    if (!category) return;

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
  }, [category]);

  const onSubmit: SubmitHandler<CreateRegistrationInput> = (data) => {
    createMutation.mutate(data);
  };

  const onError = (validationError: FieldErrors<CreateRegistrationInput>) => {
    const { categoryId, competitors } = validationError;

    console.log(validationError);

    if (categoryId) {
      return toast.error(categoryId.message);
    }

    if (competitors) {
      return toast.error("");
    }
  };

  return {
    form,
    isPending: createMutation.isPending,
    onSubmit,
    onError,
    fields,
  };
}
