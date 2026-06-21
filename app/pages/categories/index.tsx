import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import type { Route } from "../../pages/categories/+types";
import { CategoryCard } from "../../components/category-card";
import { type CategoryType } from "./schema";

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
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const handleSubmit = (data: CategoryType) => {
    setCategories((value) => [...value, data]);
  };

  return (
    <>
      <CategoryCard handleSubmit={handleSubmit} />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {categories?.map((category) => (
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.competitors} competidores para {category.rounds}{" "}
                voltas.
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
