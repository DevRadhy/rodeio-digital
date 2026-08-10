import { api } from "@/providers/api";
import {
  CategorySchema,
  type CategorySchemaType,
} from "@/schemas/category-schema";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFieldArray, useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";

const DEFAULT_FINAL_GROUP = () => ({
  id: v4(),
  name: "Final",
  qualifyingShots: [],
});

interface CategoryFormProps {
  onOpenChange: (open: boolean) => void;
}

export function useCategoryForm({ onOpenChange }: CategoryFormProps) {
  const { editingCategory, setEditingCategory } =
    useCategoryStore();

  const handleCategorySave = async (props: Category) => {
    try {
      const { data } = await api.post("/categories", props)

      return data
    } catch (error) {}
  }
    
  const mutation = useMutation({
    mutationFn: handleCategorySave,
    onSuccess: (result, _variables, _onMutateResult, context) => {
      context.client.setQueryData(['categories'], (old: any) => [...old, result])
    }
  })

  const form = useForm<CategorySchemaType>({
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

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  const duel = form.watch("duel");

  const createDefaultCategory = (): CategorySchemaType => ({
    name: "",
    competitorsPerRegistration: 1,
    qualification: {
      qualifyingRounds: 1,
      elimination: true,
    },
    duel: false,
    groups: [DEFAULT_FINAL_GROUP()],
  });

  useEffect(() => {
    form.reset(editingCategory ?? createDefaultCategory());
  }, [editingCategory, open]);

  const onSubmit = (data: Category) => {
    if (editingCategory) {
      return 
    }

    mutation.mutateAsync(data)

    onClose();
  };

  const onError = (validationError: FieldErrors<CategorySchemaType>) => {
    const errors = Object.values(validationError);

    console.log(validationError)

    return toast.error(errors[0].message);
  };

  const onClose = () => {
    setEditingCategory(undefined);
    onOpenChange(false);
    form.reset();
  };

  const onDuelChange = (checked: boolean) => {
    if (!checked) {
      replace([
        {
          id: v4(),
          name: "Final",
          qualifyingShots:
            form.getValues("groups.0.qualifyingShots") ?? [],
        },
      ]);

      return;
    }

    const groups = form.getValues("groups");

    if (groups.length === 1 && groups[0].name === "Final") {
      replace([
        {
          id: v4(),
          name: "A",
          qualifyingShots: [],
        },
        {
          id: v4(),
          name: "B",
          qualifyingShots: [],
        },
        {
          id: v4(),
          name: "C",
          qualifyingShots: [],
        },
      ]);
    }
  };

  return {
    form,
    fields,
    duel,
    append,
    remove,
    onSubmit,
    onError,
    onClose,
    onDuelChange,
  };
}
