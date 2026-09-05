import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  CategorySchema,
  type CreateCategoryInput,
} from "@/features/categories/schemas/category-schema";
import { formErrorMessages, requestErrorMessage } from "@/lib/form-errors";
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
      categoryType: "normal",
      finalBonusEnabled: false,
      finalBonusLives: 0,
      competitorsPerRegistration: 1,
      qualification: {
        rounds: 1,
        pelotonSize: 10,
      },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
      reset();
    },
    onError: (error) => {
      const message = requestErrorMessage(
        error,
        "Não foi possível cadastrar a modalidade. Confira os dados e tente novamente.",
      );
      form.setError("root.server", { message });
      toast.error(message);
    },
  });

  const onSubmit = (data: CreateCategoryInput) => {
    if (createMutation.isPending) return;
    form.clearErrors("root");
    createMutation.mutate(data);
  };

  const onError = (validationError: FieldErrors<CreateCategoryInput>) => {
    toast.error(
      formErrorMessages(validationError)[0] ?? "Confira os campos indicados.",
    );
  };

  const onClose = () => {
    if (createMutation.isPending) return;
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

  const onCategoryTypeChange = (type: CreateCategoryInput["categoryType"]) => {
    form.setValue("categoryType", type);
    onDuelChange(type === "duel");
    if (type === "elimination" || type === "summation")
      replace([{ name: "Final", qualificationScores: [] }]);
  };

  return {
    onCategoryTypeChange,
    isPending: createMutation.isPending,
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
