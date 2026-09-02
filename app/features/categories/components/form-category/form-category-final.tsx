import { Plus, Trash2 } from "lucide-react";
import {
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { CreateCategoryInput } from "@/features/categories/schemas/category-schema";
import { getGroupName } from "@/utils";
import { FormQualifyingShots } from "./form-qualifying-shots";

interface FormCategoryFinalProps {
  fields: FieldArrayWithId<CreateCategoryInput>[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<CreateCategoryInput>;
}

export function FormCategoryFinal({
  fields,
  remove,
  append,
}: FormCategoryFinalProps) {
  const { control } = useFormContext();

  const categoryType = useWatch({
    name: "categoryType",
    control,
  });

  return (
    <FieldGroup>
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent>
            <FormInput
              control={control}
              name={`finals.${index}.name`}
              label={
                categoryType === "duel" ? "Nome da Força" : "Nome da Final"
              }
              description="Nome do grupo de classificação."
              type="text"
              placeholder={`padrão Força ${getGroupName(index)}`}
            />

            {(categoryType === "normal" || categoryType === "duel") && (
              <FormQualifyingShots
                name={`finals.${index}.qualificationScores`}
              />
            )}
          </CardContent>
          <CardFooter>
            {fields.length > 1 && (
              <Button
                type="button"
                variant={"destructive"}
                className={"w-full"}
                onClick={() => remove(index)}
              >
                <Trash2 /> Remover força
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      {categoryType === "duel" && (
        <Button
          type="button"
          variant={"outline"}
          onClick={() =>
            append({
              name: getGroupName(fields.length),
              qualificationScores: [],
            })
          }
        >
          <Plus /> Adicionar Força
        </Button>
      )}
    </FieldGroup>
  );
}
