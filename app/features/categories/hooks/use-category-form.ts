import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  CategorySchema,
  type CreateCategoryInput,
} from "@/schemas/category-schema";
import type { Category } from "@/types/category";
import { createCategory } from "../services/category-service";

const DEFAULT_FINAL_GROUP = () => ({
  id: v4(),
  name: "Final",
  qualifyingShots: [],
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
        qualifyingRounds: 1,
        elimination: true,
      },
      duel: false,
      groups: [DEFAULT_FINAL_GROUP()],
    },
  });

  const { reset, control, getValues } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control: control,
    name: "groups",
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
          qualifyingShots: getValues("groups.0.qualifyingShots") ?? [],
        },
      ]);

      return;
    }

    const groups = getValues("groups");

    if (groups.length === 1 && groups[0].name === "Final") {
      replace([
        {
          name: "A",
          qualifyingShots: [],
        },
        {
          name: "B",
          qualifyingShots: [],
        },
        {
          name: "C",
          qualifyingShots: [],
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
