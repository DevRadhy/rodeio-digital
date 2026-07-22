import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryModal } from "../../components/category-modal";
import type { Route } from "../../pages/categories/+types";
import { EmptyCategories } from "./empty";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, Users } from "lucide-react";
import { useCompetition } from "@/context/competition";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Modalidades" },
    {
      name: "Crie uma nova modalidade.",
      content: "Crie, edite e reoganize as modalidades do seu evento.",
    },
  ];
}

export default function Categories() {
  const { categories, addCategory } = useCompetition();

  return categories.length ? (
    <>
      <CategoryModal
        handleSubmit={addCategory}
        render={
          <Button>
            <Plus /> Adicionar Modalidade
          </Button>
        }
      />
      <div className="my-2 flex flex-col gap-4">
        {categories?.map((category) => (
          <Item variant={"outline"}>
            <ItemMedia variant={"icon"}>
              <Users />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{category.name}</ItemTitle>
              <ItemDescription className="flex flex-wrap gap-2">
                <Badge variant={"secondary"}>
                  {category.competitors}{" "}
                  {category.competitors <= 1 ? "competidor" : "comptidores"}
                </Badge>
                <Badge variant={"secondary"}>{category.rounds} voltas</Badge>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant={"default"}>
                <Edit />
              </Button>
              <Button variant={"destructive"}>
                <Trash2 />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </>
  ) : (
    <EmptyCategories>
      <CategoryModal
        handleSubmit={addCategory}
        render={<Button>Adicionar Modalidade</Button>}
      />
    </EmptyCategories>
  );
}
