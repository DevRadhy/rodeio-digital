import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { CategorySchemaType } from "@/schemas/category-schema";
import { getGroupName } from "@/utils";
import { Plus, Trash2 } from "lucide-react";
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { v4 } from "uuid";
import { FormQualifyingShots } from "./form-qualifying-shots";

interface FormCategoryFinalProps {
  control: Control<CategorySchemaType>;
  fields: FieldArrayWithId<CategorySchemaType>[];
  duel: boolean;
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<CategorySchemaType>;
}

export function FormCategoryFinal({
  control,
  fields,
  duel,
  remove,
  append,
}: FormCategoryFinalProps) {
  return (
    <FieldGroup>
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent>
            <FormInput
              control={control}
              name={`groups.${index}.name`}
              label="Nome da Força"
              description="Nome da Força de classificação."
              type="text"
              placeholder={`padrão Força ${getGroupName(index)}`}
            />

            <FormQualifyingShots
              control={control}
              name={`groups.${index}.qualifyingShots`}
            />
          </CardContent>
          <CardFooter>
            {fields.length > 1 && (
              <Button
                type="button"
                variant={"destructive"}
                className={"w-full"}
                onClick={() => remove(index)}
              >
                <Trash2 />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      {duel && (
        <Button
          type="button"
          variant={"ghost"}
          onClick={() =>
            append({
              id: v4(),
              name: getGroupName(fields.length),
              qualifyingShots: [],
            })
          }
        >
          <Plus /> Adicionar Força
        </Button>
      )}
    </FieldGroup>
  );
}
