import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryCard } from "../../components/category-card";
import type { Route } from "../../pages/categories/+types";
import { EmptyCategories } from "./empty";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCompetition } from "@/context/competition";

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
      <CategoryCard
        handleSubmit={addCategory}
        render={
          <Button>
            <Plus /> Adicionar Modalidade
          </Button>
        }
      />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {categories?.map((category) => (
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant={"secondary"}>
                  {category.competitors}{" "}
                  {category.competitors <= 1 ? "competidor" : "comptidores"}
                </Badge>
                <Badge variant={"secondary"}>{category.rounds} voltas</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  ) : (
    <EmptyCategories>
      <CategoryCard
        handleSubmit={addCategory}
        render={<Button>Adicionar Modalidade</Button>}
      />
    </EmptyCategories>
  );
}
