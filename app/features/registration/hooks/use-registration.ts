import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  type FieldErrors,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  type CreateRegistrationInput,
  RegistrationSchema,
} from "@/features/registration/schemas/registration-schema";
import type { Category } from "@/types/category";
import { createRegistration } from "../services/registration-service";

interface RegistrationProps {
  category: Category | null;
}

export function useRegistration({ category }: RegistrationProps) {
  const queryClient = useQueryClient();

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
    onSuccess: (data, _variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });

      context.client.setQueryData(["registrations"], (old: Category[]) => [
        ...old,
        data,
      ]);
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
          id: v4(),
          name: "",
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
    onSubmit,
    onError,
    fields,
  };
}
