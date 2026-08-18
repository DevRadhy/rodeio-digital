import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  CategorySchema,
  type CreateCategoryInput,
} from "@/features/categories/schemas/category-schema";
import type { Category } from "@/features/categories/types/category";
import { createCategory } from "../api/create-category";

const DEFAULT_FINAL_GROUP = () => ({
  id: v4(),
  name: "Final",
  qualificationScores: [],
});

interface CategoryFormProps {
  onOpenChange: (open: boolean) => void;
}

export function useCategoryForm({ onOpenChange }: CategoryFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      competitorsPerRegistration: 1,
      qualification: {
        rounds: 1,
        elimination: true,
      },
      duel: false,
      finals: [DEFAULT_FINAL_GROUP()],
    },
  });

  const { reset, control, getValues } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control: control,
    name: "finals",
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data, _variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      context.client.setQueryData(["categories"], (old: Category[]) => [
        ...old,
        data,
      ]);

      onClose();
    },
  });

  const onSubmit = (data: CreateCategoryInput) => {
    createMutation.mutate(data);
  };

  const onError = (validationError: FieldErrors<CreateCategoryInput>) => {
    const errors = Object.values(validationError);

    console.log(validationError);

    return toast.error(errors[0].message);
  };

  const onClose = () => {
    onOpenChange(false);
    reset();
  };

  const onDuelChange = (checked: boolean) => {
    if (!checked) {
      replace([
        {
          name: "Final",
          qualificationScores: getValues("finals.0.qualificationScores") ?? [],
        },
      ]);

      return;
    }

    const finals = getValues("finals");

    if (finals.length === 1 && finals[0].name === "Final") {
      replace([
        {
          name: "A",
          qualificationScores: [],
        },
        {
          name: "B",
          qualificationScores: [],
        },
        {
          name: "C",
          qualificationScores: [],
        },
      ]);
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    onSubmit,
    onError,
    onClose,
    onDuelChange,
  };
}
